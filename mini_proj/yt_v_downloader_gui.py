#!/usr/bin/env python3
"""
yt_v_downloader_gui.py

Simple Tkinter GUI wrapper around yt-dlp to download YouTube videos at
selected resolutions: 360p, 480p, 720p, 1080p, 1440p, 2160p, All (best), or
Audio only.

Dependencies:
    pip install yt-dlp
    ffmpeg must be installed and available on PATH for merging video+audio.

Usage:
    python yt_v_downloader_gui.py
"""

import os
import queue
import threading
import traceback
import yt_dlp
import tkinter as tk
from tkinter import filedialog, messagebox, ttk


DEFAULT_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-us,en;q=0.5",
    "Referer": "https://www.youtube.com/",
}


def format_selector(choice):
    normalized = choice.strip().lower()
    if normalized == "360p":
        return "bestvideo[height<=360]+bestaudio/best[height<=360]"
    if normalized == "480p":
        return "bestvideo[height<=480]+bestaudio/best[height<=480]"
    if normalized == "720p":
        return "bestvideo[height<=720]+bestaudio/best[height<=720]"
    if normalized == "1080p":
        return "bestvideo[height<=1080]+bestaudio/best[height<=1080]"
    if normalized == "1440p":
        return "bestvideo[height<=1440]+bestaudio/best[height<=1440]"
    if normalized == "2160p":
        return "bestvideo[height<=2160]+bestaudio/best[height<=2160]"
    if normalized in ("all (best)", "best", "all"):
        return "best"
    if normalized in ("audio only", "audio"):
        return "bestaudio/best"
    return "best"


def build_retry_sleep_functions():
    def backoff(attempt):
        return min(max(1, attempt) * 2, 10)

    return {
        "extractor": backoff,
        "http": backoff,
    }


class YouTubeDownloaderApp:
    def __init__(self, root):
        self.root = root
        root.title("YouTube Downloader")
        root.geometry("680x360")
        root.resizable(False, False)

        self.ui_queue = queue.Queue()
        self._progress_value = 0.0
        self._is_downloading = False
        self.root.after(100, self._drain_ui_queue)

        frm_url = ttk.Frame(root, padding=(12, 8))
        frm_url.pack(fill="x")
        ttk.Label(frm_url, text="YouTube URL:").pack(anchor="w")
        self.url_var = tk.StringVar()
        self.entry_url = ttk.Entry(frm_url, textvariable=self.url_var)
        self.entry_url.pack(fill="x", pady=4)

        frm_opts = ttk.Frame(root, padding=(12, 8))
        frm_opts.pack(fill="x")
        frm_opts.columnconfigure(1, weight=1)

        ttk.Label(frm_opts, text="Resolution:").grid(row=0, column=0, sticky="w")
        self.res_var = tk.StringVar(value="720p")
        res_choices = [
            "360p",
            "480p",
            "720p",
            "1080p",
            "1440p",
            "2160p",
            "All (best)",
            "Audio only",
        ]
        self.res_combo = ttk.Combobox(frm_opts, values=res_choices, state="readonly", textvariable=self.res_var)
        self.res_combo.grid(row=0, column=1, sticky="w", padx=6)

        ttk.Label(frm_opts, text="Output folder:").grid(row=1, column=0, sticky="w", pady=(8, 0))
        self.outdir_var = tk.StringVar(value=os.path.expanduser("~"))
        outdir_frame = ttk.Frame(frm_opts)
        outdir_frame.grid(row=1, column=1, sticky="we", padx=6)
        self.entry_out = ttk.Entry(outdir_frame, textvariable=self.outdir_var, width=40)
        self.entry_out.pack(side="left", fill="x", expand=True)
        ttk.Button(outdir_frame, text="Browse", command=self.browse_outdir).pack(side="left", padx=(6, 0))

        ttk.Label(frm_opts, text="Browser cookies:").grid(row=2, column=0, sticky="w", pady=(8, 0))
        self.cookies_browser_var = tk.StringVar(value="None")
        browser_choices = ["None", "chrome", "firefox", "brave", "edge", "chromium", "vivaldi"]
        self.cookies_browser_combo = ttk.Combobox(
            frm_opts,
            values=browser_choices,
            state="readonly",
            textvariable=self.cookies_browser_var,
        )
        self.cookies_browser_combo.grid(row=2, column=1, sticky="w", padx=6)

        ttk.Label(frm_opts, text="Cookies file:").grid(row=3, column=0, sticky="w", pady=(8, 0))
        self.cookies_file_var = tk.StringVar()
        cookies_file_frame = ttk.Frame(frm_opts)
        cookies_file_frame.grid(row=3, column=1, sticky="we", padx=6)
        self.entry_cookie_file = ttk.Entry(cookies_file_frame, textvariable=self.cookies_file_var, width=40)
        self.entry_cookie_file.pack(side="left", fill="x", expand=True)
        ttk.Button(cookies_file_frame, text="Browse", command=self.browse_cookie_file).pack(
            side="left", padx=(6, 0)
        )

        ttk.Label(
            frm_opts,
            text="Use browser cookies or a cookies.txt export only if YouTube asks you to sign in.",
            wraplength=640,
        ).grid(row=4, column=0, columnspan=2, sticky="w", pady=(10, 0))

        btn_frame = ttk.Frame(root, padding=(12, 6))
        btn_frame.pack(fill="x")
        self.btn_download = ttk.Button(btn_frame, text="Download", command=self.start_download)
        self.btn_download.pack(side="left")
        ttk.Button(btn_frame, text="Quit", command=root.quit).pack(side="right")

        status_frame = ttk.Frame(root, padding=(12, 6))
        status_frame.pack(fill="x", pady=(4, 0))
        self.progress = ttk.Progressbar(status_frame, orient="horizontal", length=400, mode="determinate")
        self.progress.pack(fill="x")
        self.status_var = tk.StringVar(value="Idle")
        ttk.Label(status_frame, textvariable=self.status_var).pack(anchor="w", pady=(6, 0))

    def browse_outdir(self):
        folder = filedialog.askdirectory(initialdir=self.outdir_var.get() or os.path.expanduser("~"))
        if folder:
            self.outdir_var.set(folder)

    def browse_cookie_file(self):
        cookie_file = filedialog.askopenfilename(
            title="Select cookies file",
            filetypes=[("Text files", "*.txt"), ("All files", "*.*")],
        )
        if cookie_file:
            self.cookies_file_var.set(cookie_file)

    def start_download(self):
        url = self.url_var.get().strip()
        if not url:
            messagebox.showwarning("No URL", "Please paste a YouTube video URL first.")
            return
        if self._is_downloading:
            messagebox.showinfo("Downloading", "A download is already in progress.")
            return

        outdir = self.outdir_var.get().strip() or os.path.expanduser("~")
        if not os.path.isdir(outdir):
            try:
                os.makedirs(outdir, exist_ok=True)
            except Exception as error:
                messagebox.showerror("Invalid folder", f"Could not create output folder:\n{error}")
                return

        cookies_file = self.cookies_file_var.get().strip()
        if cookies_file and not os.path.isfile(cookies_file):
            messagebox.showerror("Invalid cookies file", "The selected cookies file does not exist.")
            return

        cookies_browser = self.cookies_browser_var.get().strip()

        self.btn_download.config(state="disabled")
        self._is_downloading = True
        self._progress_value = 0.0
        self.progress["value"] = 0
        self.progress["maximum"] = 100
        self.status_var.set("Queued...")

        worker = threading.Thread(
            target=self._download_worker,
            args=(url, self.res_var.get(), outdir, cookies_browser, cookies_file),
            daemon=True,
        )
        worker.start()

    def _build_ydl_opts(self, choice, outdir, cookies_browser="", cookies_file=""):
        ydl_opts = {
            "format": format_selector(choice),
            "outtmpl": os.path.join(outdir, "%(title)s.%(ext)s"),
            "progress_hooks": [self._progress_hook],
            "noprogress": True,
            "quiet": True,
            "no_warnings": False,
            "retries": 3,
            "extractor_retries": 5,
            "retry_sleep_functions": build_retry_sleep_functions(),
            "noplaylist": True,
            "http_headers": dict(DEFAULT_HEADERS),
        }

        normalized_browser = cookies_browser.strip().lower()
        if normalized_browser and normalized_browser != "none":
            ydl_opts["cookiesfrombrowser"] = (normalized_browser,)
        elif cookies_file:
            ydl_opts["cookiefile"] = cookies_file

        return ydl_opts

    def _friendly_error(self, error):
        error_text = str(error)
        lower_error = error_text.lower()
        if "sign in to confirm you're not a bot" in lower_error:
            return (
                "YouTube requested sign-in verification. Select a browser in "
                "'Browser cookies' or provide a cookies.txt file and try again."
            )
        if "ffmpeg is not installed" in lower_error or "ffprobe and ffmpeg not found" in lower_error:
            return "ffmpeg is required to merge audio and video streams. Install ffmpeg and try again."
        return error_text

    def _should_fallback_format(self, choice, error):
        return choice not in ("All (best)", "Audio only") and "requested format is not available" in str(error).lower()

    def _download_worker(self, url, choice, outdir, cookies_browser, cookies_file):
        try:
            self._set_status_safe("Starting download...")
            info_opts = dict(self._build_ydl_opts("All (best)", outdir, cookies_browser, cookies_file))
            info_opts.pop("format", None)
            info_opts.pop("progress_hooks", None)
            with yt_dlp.YoutubeDL(info_opts) as ydl:
                info = ydl.extract_info(url, download=False)
                title = info.get("title", "video")
                self._set_status_safe(f"Downloading: {title}")

            try:
                with yt_dlp.YoutubeDL(self._build_ydl_opts(choice, outdir, cookies_browser, cookies_file)) as ydl:
                    ydl.download([url])
            except yt_dlp.utils.DownloadError as error:
                if not self._should_fallback_format(choice, error):
                    raise

                self._set_status_safe("Requested format unavailable. Retrying with best...")
                with yt_dlp.YoutubeDL(
                    self._build_ydl_opts("All (best)", outdir, cookies_browser, cookies_file)
                ) as ydl:
                    ydl.download([url])

            self._set_status_safe("Finished.")
            self._finish_safe(success=True, message=f"Download finished: {title}")
        except yt_dlp.utils.DownloadError as error:
            self._set_status_safe("Download failed.")
            self._finish_safe(success=False, message=self._friendly_error(error))
        except Exception as error:
            print(traceback.format_exc())
            self._set_status_safe("Error during download.")
            self._finish_safe(success=False, message=f"Error: {self._friendly_error(error)}")
        finally:
            self._reset_after_download_safe()

    def _drain_ui_queue(self):
        while True:
            try:
                callback, args, kwargs = self.ui_queue.get_nowait()
            except queue.Empty:
                break
            callback(*args, **kwargs)

        self.root.after(100, self._drain_ui_queue)

    def _queue_ui(self, callback, *args, **kwargs):
        self.ui_queue.put((callback, args, kwargs))

    def _set_status(self, text):
        self.status_var.set(text)

    def _set_status_safe(self, text):
        self._queue_ui(self._set_status, text)

    def _set_progress(self, percent):
        self._progress_value = max(0.0, min(100.0, percent))
        self.progress["value"] = self._progress_value
        self.status_var.set(f"Downloading... {self._progress_value:.1f}%")

    def _set_progress_safe(self, percent):
        self._queue_ui(self._set_progress, percent)

    def _finish_download(self, success=True, message=""):
        if success:
            messagebox.showinfo("Done", message or "Download completed.")
        else:
            messagebox.showerror("Failed", message or "Download failed.")
        self.status_var.set("Idle")
        self.progress["value"] = 0
        self._progress_value = 0.0

    def _finish_safe(self, success=True, message=""):
        self._queue_ui(self._finish_download, success, message)

    def _reset_after_download(self):
        self.btn_download.config(state="normal")
        self._is_downloading = False

    def _reset_after_download_safe(self):
        self._queue_ui(self._reset_after_download)

    def _progress_hook(self, data):
        status = data.get("status")
        if status == "downloading":
            downloaded = data.get("downloaded_bytes") or data.get("downloaded") or 0
            total = data.get("total_bytes") or data.get("total_bytes_estimate") or 0
            if total:
                percent = (downloaded / total) * 100.0
                self._progress_value = percent
                self._set_progress_safe(percent)
            else:
                next_value = min(99.0, self._progress_value + 0.7)
                self._progress_value = next_value
                self._set_progress_safe(next_value)
        elif status == "finished":
            self._set_progress_safe(100.0)
            self._set_status_safe("Processing (merging/encoding)...")


def main():
    root = tk.Tk()
    try:
        style = ttk.Style()
        style.theme_use("clam")
    except Exception:
        pass
    YouTubeDownloaderApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
