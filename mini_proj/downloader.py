#!/usr/bin/env python3
"""
youtube_downloader_gui.py

Simple Tkinter GUI wrapper around yt-dlp to download YouTube videos at
selected resolutions: 360p, 480p, 720p, 1080p, All (best) or Audio only.

Dependencies:
    pip install yt-dlp
    ffmpeg must be installed and available on PATH for merging video+audio.

Usage:
    python youtube_downloader_gui.py
"""

import os
import threading
import math
import traceback
import yt_dlp
import tkinter as tk
from tkinter import ttk, messagebox, filedialog

class YouTubeDownloaderApp:
    def __init__(self, root):
        self.root = root
        root.title("YouTube Downloader")
        root.geometry("560x240")
        root.resizable(False, False)

        # --- URL frame ---
        frm_url = ttk.Frame(root, padding=(12, 8))
        frm_url.pack(fill="x")
        ttk.Label(frm_url, text="YouTube URL:").pack(anchor="w")
        self.url_var = tk.StringVar()
        self.entry_url = ttk.Entry(frm_url, textvariable=self.url_var)
        self.entry_url.pack(fill="x", pady=4)

        # --- Options frame ---
        frm_opts = ttk.Frame(root, padding=(12, 8))
        frm_opts.pack(fill="x")

        ttk.Label(frm_opts, text="Resolution:").grid(row=0, column=0, sticky="w")
        self.res_var = tk.StringVar(value="720p")
        res_choices = ["360p", "480p", "720p", "1080p", "All (best)", "Audio only"]
        self.res_combo = ttk.Combobox(frm_opts, values=res_choices, state="readonly", textvariable=self.res_var)
        self.res_combo.grid(row=0, column=1, sticky="w", padx=6)

        ttk.Label(frm_opts, text="Output folder:").grid(row=1, column=0, sticky="w", pady=(8,0))
        self.outdir_var = tk.StringVar(value=os.path.expanduser("~"))
        outdir_frame = ttk.Frame(frm_opts)
        outdir_frame.grid(row=1, column=1, sticky="we", padx=6)
        self.entry_out = ttk.Entry(outdir_frame, textvariable=self.outdir_var, width=40)
        self.entry_out.pack(side="left", fill="x", expand=True)
        ttk.Button(outdir_frame, text="Browse", command=self.browse_outdir).pack(side="left", padx=(6,0))

        # --- Buttons ---
        btn_frame = ttk.Frame(root, padding=(12, 6))
        btn_frame.pack(fill="x")
        self.btn_download = ttk.Button(btn_frame, text="Download", command=self.start_download)
        self.btn_download.pack(side="left")
        ttk.Button(btn_frame, text="Quit", command=root.quit).pack(side="right")

        # --- Progress / status ---
        status_frame = ttk.Frame(root, padding=(12, 6))
        status_frame.pack(fill="x", pady=(4,0))
        self.progress = ttk.Progressbar(status_frame, orient="horizontal", length=400, mode="determinate")
        self.progress.pack(fill="x")
        self.status_var = tk.StringVar(value="Idle")
        ttk.Label(status_frame, textvariable=self.status_var).pack(anchor="w", pady=(6,0))

        # internal
        self._is_downloading = False

    def browse_outdir(self):
        folder = filedialog.askdirectory(initialdir=self.outdir_var.get() or os.path.expanduser("~"))
        if folder:
            self.outdir_var.set(folder)

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
            except Exception as e:
                messagebox.showerror("Invalid folder", f"Could not create output folder:\n{e}")
                return

        # disable button while the download runs
        self.btn_download.config(state="disabled")
        self._is_downloading = True
        self.progress['value'] = 0
        self.progress['maximum'] = 100
        self.status_var.set("Queued...")

        # run downloader in a separate thread to keep UI responsive
        t = threading.Thread(target=self._download_worker, args=(url, self.res_var.get(), outdir), daemon=True)
        t.start()

    def _format_for_choice(self, choice):
        """Return yt-dlp format selector string for given choice."""
        # Use merged video+audio where available; fallback to best of certain height
        if choice == "360p":
            return "bestvideo[height<=360]+bestaudio/best[height<=360]"
        if choice == "480p":
            return "bestvideo[height<=480]+bestaudio/best[height<=480]"
        if choice == "720p":
            return "bestvideo[height<=720]+bestaudio/best[height<=720]"
        if choice == "1080p":
            return "bestvideo[height<=1080]+bestaudio/best[height<=1080]"
        if choice == "All (best)":
            return "best"
        if choice == "Audio only":
            return "bestaudio/best"
        # default
        return "best"

    def _download_worker(self, url, choice, outdir):
        """Worker thread: perform the download and update UI via root.after(...)"""
        ydl_opts = {
            "format": self._format_for_choice(choice),
            "outtmpl": os.path.join(outdir, "%(title)s.%(ext)s"),
            # Progress hook will be called from the download thread; we use root.after to update UI safely.
            "progress_hooks": [self._progress_hook],
            "noprogress": True,
            # Ensure postprocessors (ffmpeg) can be used if needed; merging requires ffmpeg available.
            "postprocessors": [{
                'key': 'FFmpegMetadata'
            }],
            # quiet to not spam console; we use hooks for progress
            "quiet": True,
            "no_warnings": True,
            # retry on connection error
            "retries": 3,
        }

        try:
            self._set_status_safe("Starting download...")
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                # attempt metadata extraction first so we can show title in UI
                info = ydl.extract_info(url, download=False)
                title = info.get("title", "video")
                self._set_status_safe(f"Downloading: {title}")
                # now actually download
                ydl.download([url])
            self._set_status_safe("Finished.")
            self._finish_safe(success=True, message="Download finished.")
        except Exception as e:
            # capture stack trace for debugging but show a clean message
            tb = traceback.format_exc()
            print(tb)
            self._set_status_safe("Error during download.")
            self._finish_safe(success=False, message=f"Error: {e}")
        finally:
            # re-enable download button
            self.root.after(0, lambda: self.btn_download.config(state="normal"))
            self._is_downloading = False

    # --- UI helper methods that are safe to call from worker thread ---
    def _set_status_safe(self, text):
        self.root.after(0, lambda: self.status_var.set(text))

    def _set_progress_safe(self, percent):
        # percent is 0..100
        percent = max(0.0, min(100.0, percent))
        def upd():
            self.progress['value'] = percent
            self.status_var.set(f"Downloading... {percent:.1f}%")
        self.root.after(0, upd)

    def _finish_safe(self, success=True, message=""):
        def done():
            if success:
                messagebox.showinfo("Done", message or "Download completed.")
            else:
                messagebox.showerror("Failed", message or "Download failed.")
            self.status_var.set("Idle")
            self.progress['value'] = 0
        self.root.after(0, done)

    def _progress_hook(self, d):
        """
        yt-dlp progress hook. Called in downloader thread.
        d is a dict. Common keys:
            status: "downloading" or "finished"
            downloaded_bytes
            total_bytes or total_bytes_estimate
            elapsed
            speed
            filename
        """
        status = d.get("status")
        if status == "downloading":
            downloaded = d.get("downloaded_bytes") or d.get("downloaded") or 0
            total = d.get("total_bytes") or d.get("total_bytes_estimate") or 0
            if total:
                percent = (downloaded / total) * 100.0
                self._set_progress_safe(percent)
            else:
                # unknown total -> show indefinite spinner-like indicator by incrementing a little
                # but progressbar is determinate so we just show a small fake progress
                # accumulate a small increment so it moves
                current = self.progress['value'] or 0
                newv = min(99.0, current + 0.7)
                self._set_progress_safe(newv)
        elif status == "finished":
            # finished downloading of a part (if merging needed), set to 100
            self._set_progress_safe(100.0)
            self._set_status_safe("Processing (merging/encoding)...")


def main():
    root = tk.Tk()
    # Use ttk theme
    try:
        style = ttk.Style()
        style.theme_use('clam')
    except Exception:
        pass
    app = YouTubeDownloaderApp(root)
    root.mainloop()

if __name__ == "__main__":
    main()
