# #!/usr/bin/env python3
# """
# yt_downloader_cli.py

# Robust CLI YouTube downloader using yt-dlp.

# Features:
#  - Accepts one or more YouTube URLs as arguments or interactively.
#  - Resolution choices: 360p, 480p, 720p, 1080p, 1440p, 2160p, best, audio
#  - Choose output directory
#  - Shows progress (percent, speed, ETA) in console using yt-dlp progress hooks
#  - Extra resilience for HTTP 403 (HLS fragments): ffmpeg HLS fallback, allow_unplayable_formats,
#    geo-bypass, referer header, and automatic retry on 403 with fallback options.

# Dependencies:
#     pip install yt-dlp
#     ffmpeg must be installed for merging audio+video for many formats.
# """

# import argparse
# import os
# import sys
# import traceback
# from datetime import timedelta

# try:
#     import yt_dlp as ytdl
#     from yt_dlp.utils import DownloadError
# except Exception:
#     print("Missing dependency: yt-dlp. Install with: pip install yt-dlp")
#     sys.exit(1)


# def format_selector(choice: str) -> str:
#     """Return yt-dlp 'format' selector for a given friendly choice."""
#     if not choice:
#         return "best"
#     key = choice.strip().lower()
#     mapping = {
#         "360p": "bestvideo[height<=360]+bestaudio/best[height<=360]",
#         "480p": "bestvideo[height<=480]+bestaudio/best[height<=480]",
#         "720p": "bestvideo[height<=720]+bestaudio/best[height<=720]",
#         "1080p": "bestvideo[height<=1080]+bestaudio/best[height<=1080]",
#         "1440p": "bestvideo[height<=1440]+bestaudio/best[height<=1440]",
#         "2160p": "bestvideo[height<=2160]+bestaudio/best[height<=2160]",
#         "best": "best",
#         "all": "best",
#         "audio": "bestaudio/best",
#     }
#     return mapping.get(key, "best")


# def human_readable_size(bytes_num: int) -> str:
#     """Return human readable size (e.g. '3.4MB'). Handles None/0 safely."""
#     if bytes_num is None:
#         return "N/A"
#     try:
#         bytes_num = float(bytes_num)
#     except Exception:
#         return "N/A"
#     if bytes_num == 0:
#         return "0B"
#     units = ("B", "KB", "MB", "GB", "TB", "PB")
#     idx = 0
#     while bytes_num >= 1024.0 and idx < len(units) - 1:
#         bytes_num /= 1024.0
#         idx += 1
#     return f"{bytes_num:3.1f}{units[idx]}"


# def human_time(seconds) -> str:
#     """Return H:MM:SS style ETA string. Handles None and non-int inputs."""
#     if seconds is None:
#         return "N/A"
#     try:
#         seconds = int(seconds)
#     except Exception:
#         return "N/A"
#     if seconds < 0:
#         return "N/A"
#     return str(timedelta(seconds=seconds))


# class CLIDownloader:
#     def __init__(self, outdir: str, fmt_choice: str, allow_playlist=False, quiet=False, cookies=None):
#         self.outdir = outdir
#         self.format_choice = fmt_choice
#         self.allow_playlist = allow_playlist
#         self.quiet = bool(quiet)
#         self.cookies = cookies
#         self.last_line_len = 0

#         # Base yt-dlp options
#         self.ydl_opts = {
#             "format": format_selector(fmt_choice),
#             "outtmpl": os.path.join(self.outdir, "%(title)s.%(ext)s"),
#             "progress_hooks": [self._progress_hook],
#             "noplaylist": not self.allow_playlist,
#             "no_warnings": self.quiet,
#             "quiet": self.quiet,
#             "retries": 3,
#             "http_headers": {
#                 # default UA (can be extended below)
#                 "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
#             },
#         }
#         if self.cookies:
#             # allow direct path to cookiefile; leave as-is if None
#             self.ydl_opts["cookiefile"] = self.cookies

#         # Extra resilience options commonly helpful for 403 / HLS issues
#         extra_opts = {
#             # let ffmpeg handle HLS fragments (can avoid some 403s)
#             "hls_prefer_ffmpeg": True,
#             "hls_prefer_native": False,
#             # try unplayable formats if yt-dlp flags them (sometimes works)
#             "allow_unplayable_formats": True,
#             # attempt geo bypass (useful for geo-restricted streams)
#             "geo_bypass": True,
#             # keep extractor retries reasonable
#             "extractor_retries": 3,
#             # increase socket timeout slightly
#             "socket_timeout": 15,
#             # chunk size for downloads (1MB)
#             "http_chunk_size": 1048576,
#             # add referer to resemble browser requests (can help some CDNs)
#             "http_headers": {
#                 **self.ydl_opts.get("http_headers", {}),
#                 "Referer": "https://www.youtube.com/",
#             },
#         }
#         # Merge extra_opts without clobbering keys the user already provided explicitly
#         for k, v in extra_opts.items():
#             if k not in self.ydl_opts:
#                 self.ydl_opts[k] = v
#             else:
#                 # if both are dicts, merge them (e.g., http_headers)
#                 if isinstance(self.ydl_opts[k], dict) and isinstance(v, dict):
#                     merged = dict(v)
#                     merged.update(self.ydl_opts[k])
#                     self.ydl_opts[k] = merged

#     def _progress_hook(self, d):
#         """yt-dlp progress hook to print a single-line progress status."""
#         status = d.get("status")
#         if status == "downloading":
#             downloaded = d.get("downloaded_bytes") or d.get("downloaded") or 0
#             total = d.get("total_bytes") or d.get("total_bytes_estimate") or 0
#             speed = d.get("speed") or 0.0
#             eta = d.get("eta")
#             percent = (downloaded / total * 100.0) if total else None

#             if percent is not None:
#                 line = (
#                     f"Downloading: {percent:5.1f}% | "
#                     f"{human_readable_size(downloaded)}/{human_readable_size(total)} | "
#                     f"{human_readable_size(speed)}/s | ETA: {human_time(eta)}"
#                 )
#             else:
#                 line = (
#                     f"Downloading: {human_readable_size(downloaded)} downloaded | "
#                     f"{human_readable_size(speed)}/s | ETA: {human_time(eta)}"
#                 )

#             self._print_inline(line)

#         elif status == "finished":
#             filename = d.get("filename", "")
#             # show finished line and newline
#             self._print_inline("Finished downloading part -> " + os.path.basename(filename))
#             sys.stdout.write("\n")
#             sys.stdout.flush()
#             self.last_line_len = 0
#         elif status == "error":
#             self._print_inline("Error in download.\n")

#     def _print_inline(self, text: str):
#         # Only show inline progress when not quiet; otherwise do nothing
#         if self.quiet:
#             return
#         sys.stdout.write("\r" + text + " " * max(0, self.last_line_len - len(text)))
#         sys.stdout.flush()
#         self.last_line_len = len(text)

#     def _attempt_download_with_opts(self, url, opts):
#         """
#         Helper to run a single download attempt with provided ydl options.
#         Returns True on success, raises exceptions on failure.
#         """
#         with ytdl.YoutubeDL(opts) as ydl:
#             # Using ydl.download returns normally or raises DownloadError
#             ydl.download([url])
#         return True

#     def download(self, urls):
#         try:
#             for url in urls:
#                 if not url or not url.strip():
#                     continue
#                 url = url.strip()

#                 # Show starting message
#                 print()  # newline separation
#                 try:
#                     # quick extract to display title first
#                     test_opts = self.ydl_opts.copy()
#                     test_opts.update({"skip_download": True, "quiet": True})
#                     with ytdl.YoutubeDL(test_opts) as test_ydl:
#                         info = test_ydl.extract_info(url, download=False)
#                         title = info.get("title") if isinstance(info, dict) else None
#                         if not title:
#                             title = url
#                         print(f"Starting: {title}")
#                 except Exception:
#                     # If extract for title fails, still continue to attempt download
#                     print(f"Starting: {url}")

#                 # Primary attempt with configured options
#                 try:
#                     self._attempt_download_with_opts(url, self.ydl_opts)
#                     if not self.quiet:
#                         print("\nDownload complete.\n")
#                     continue  # next URL on success

#                 except DownloadError as e:
#                     errstr = str(e)
#                     # If it's a 403 error, we attempt fallbacks
#                     if "HTTP Error 403" in errstr or "403" in errstr:
#                         print("⚠️ Detected HTTP 403 error. Attempting fallbacks (ffmpeg HLS, 'best', allow_unplayable_formats)...")
#                         # Build fallback options (start from current options to preserve cookies, outtmpl, etc.)
#                         fallback_opts = self.ydl_opts.copy()
#                         fallback_opts.update({
#                             "format": "best",
#                             "hls_prefer_ffmpeg": True,
#                             "hls_prefer_native": False,
#                             "allow_unplayable_formats": True,
#                             # be a bit less quiet so we can see fallback progress if user didn't request quiet
#                             "quiet": self.quiet,
#                             # increase retries a bit
#                             "retries": max(self.ydl_opts.get("retries", 3), 5),
#                         })
#                         # try fallback once (catch and show message)
#                         try:
#                             self._attempt_download_with_opts(url, fallback_opts)
#                             if not self.quiet:
#                                 print("\nFallback download complete.\n")
#                             continue  # next URL
#                         except DownloadError as e2:
#                             print("Fallback attempt also failed with DownloadError:")
#                             print(f"  {e2}")
#                             if not self.quiet:
#                                 traceback.print_exc()
#                             # proceed to final fallback below (deeper debug)
#                     else:
#                         # Not a 403 or unknown DownloadError -> show and continue
#                         print(f"\nDownloadError for {url}:\n  {e}\n")
#                         if not self.quiet:
#                             traceback.print_exc()

#                 except Exception as e:
#                     # Unexpected exception from primary attempt
#                     print(f"\nUnexpected error during download attempt for {url}:\n  {e}\n")
#                     if not self.quiet:
#                         traceback.print_exc()

#                 # Final fallback (diagnostic retry: use very minimal options and log headers)
#                 try:
#                     print("Attempting a final diagnostic retry (will try 'best' with minimal options)...")
#                     diag_opts = {
#                         "format": "best",
#                         "outtmpl": os.path.join(self.outdir, "%(title)s.%(ext)s"),
#                         "quiet": False if not self.quiet else True,
#                         "no_warnings": True,
#                         "noplaylist": not self.allow_playlist,
#                         "hls_prefer_ffmpeg": True,
#                         "allow_unplayable_formats": True,
#                         "geo_bypass": True,
#                         "socket_timeout": 15,
#                         "http_headers": {
#                             "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
#                             "Referer": "https://www.youtube.com/",
#                         },
#                     }
#                     if self.cookies:
#                         diag_opts["cookiefile"] = self.cookies
#                     with ytdl.YoutubeDL(diag_opts) as diag_ydl:
#                         diag_ydl.download([url])
#                     if not self.quiet:
#                         print("\nDiagnostic download complete.\n")
#                 except Exception as final_e:
#                     print(f"\nAll attempts failed for {url}. Last error:\n  {final_e}\n")
#                     if not self.quiet:
#                         traceback.print_exc()

#         except KeyboardInterrupt:
#             print("\nInterrupted by user.")
#         except Exception as e:
#             print(f"\nUnexpected error: {e}")
#             if not self.quiet:
#                 traceback.print_exc()


# def parse_args():
#     p = argparse.ArgumentParser(description="Simple CLI YouTube downloader (yt-dlp backend).")
#     p.add_argument("urls", nargs="*", help="YouTube URL(s). If omitted, you'll be prompted to paste URLs.")
#     p.add_argument("--resolution", "-r", default="1440p",
#                    choices=["360p", "480p", "720p", "1080p", "1440p", "2160p", "best", "audio"],
#                    help="Desired resolution/format. 'best' = best single-file, 'audio' = audio only.")
#     p.add_argument("--outdir", "-o", default="~/Downloads",
#                    help="Output directory for downloaded files. Defaults to ~/Downloads.")
#     p.add_argument("--yes", "-y", action="store_true", help="Non-interactive; assume yes for prompts.")
#     p.add_argument("--quiet", action="store_true", help="Less verbose console output.")
#     p.add_argument("--batch-file", "-b", help="Path to a text file with one URL per line.")
#     p.add_argument("--allow-playlist", action="store_true",
#                    help="Allow downloading full playlists when a playlist URL is provided.")
#     p.add_argument("--cookies", "-c", help="Path to cookies file to be used by yt-dlp for downloads.")
#     return p.parse_args()


# def main():
#     args = parse_args()

#     # collect URLs
#     urls = []
#     if args.batch_file:
#         if not os.path.isfile(args.batch_file):
#             print(f"Batch file '{args.batch_file}' not found.")
#             sys.exit(1)
#         with open(args.batch_file, "r", encoding="utf-8") as fh:
#             urls.extend([line.strip() for line in fh if line.strip()])

#     if args.urls:
#         urls.extend(args.urls)

#     # If piped input (not a TTY), read from stdin
#     if not sys.stdin.isatty():
#         stdin_text = sys.stdin.read()
#         if stdin_text:
#             urls.extend([line.strip() for line in stdin_text.splitlines() if line.strip()])

#     if not urls:
#         try:
#             raw = input("Paste one or more YouTube URLs (comma or newline separated):\n")
#             if not raw.strip():
#                 print("No URLs provided. Exiting.")
#                 sys.exit(0)
#             # allow comma or whitespace separated
#             parts = [p.strip() for part in raw.split(",") for p in part.split() if p.strip()]
#             urls.extend(parts)
#         except KeyboardInterrupt:
#             print("\nCancelled.")
#             sys.exit(0)

#     # dedupe preserving order
#     final_urls, seen = [], set()
#     for u in urls:
#         if u not in seen:
#             final_urls.append(u)
#             seen.add(u)

#     outdir = os.path.abspath(os.path.expanduser(args.outdir))
#     os.makedirs(outdir, exist_ok=True)

#     if not args.quiet:
#         print(f"Output directory: {outdir}")
#         print(f"Format choice: {args.resolution}")
#         print(f"URLs to download: {len(final_urls)}")

#     if not args.yes:
#         try:
#             if not args.quiet:
#                 cont = input("Proceed? [Y/n]: ").strip().lower()
#                 if cont not in ("", "y", "yes"):
#                     print("Aborted.")
#                     sys.exit(0)
#         except KeyboardInterrupt:
#             print("\nCancelled.")
#             sys.exit(0)

#     downloader = CLIDownloader(
#         outdir=outdir,
#         fmt_choice=args.resolution,
#         allow_playlist=args.allow_playlist,
#         quiet=args.quiet,
#         cookies=args.cookies,
#     )

#     downloader.download(final_urls)


# if __name__ == "__main__":
#     main()

#!/usr/bin/env python3
"""
yt_downloader_cli.py

Robust CLI YouTube downloader using yt-dlp.

Speed improvements:
 - Parallel downloads: --parallel N
 - External downloader (aria2c) support: --use-aria2
 - Larger chunk sizes and optional concurrent fragment downloads

Usage examples:
    python yt_downloader_cli.py "URL1" "URL2" --parallel 3 --use-aria2
    python yt_downloader_cli.py -b urls.txt --parallel 4
    python yt_downloader_cli.py "URL" --cookies ~/cookies.txt --use-aria2
"""
import argparse
import os
import sys
import traceback
from datetime import timedelta
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List

try:
    import yt_dlp as ytdl
    from yt_dlp.utils import DownloadError
except Exception:
    print("Missing dependency: yt-dlp. Install with: pip install yt-dlp")
    sys.exit(1)


def format_selector(choice: str) -> str:
    if not choice:
        return "best"
    key = choice.strip().lower()
    mapping = {
        "360p": "bestvideo[height<=360]+bestaudio/best[height<=360]",
        "480p": "bestvideo[height<=480]+bestaudio/best[height<=480]",
        "720p": "bestvideo[height<=720]+bestaudio/best[height<=720]",
        "1080p": "bestvideo[height<=1080]+bestaudio/best[height<=1080]",
        "1440p": "bestvideo[height<=1440]+bestaudio/best[height<=1440]",
        "2160p": "bestvideo[height<=2160]+bestaudio/best[height<=2160]",
        "best": "best",
        "all": "best",
        "audio": "bestaudio/best",
    }
    return mapping.get(key, "best")


def human_readable_size(bytes_num: int) -> str:
    if bytes_num is None:
        return "N/A"
    try:
        bytes_num = float(bytes_num)
    except Exception:
        return "N/A"
    if bytes_num == 0:
        return "0B"
    units = ("B", "KB", "MB", "GB", "TB", "PB")
    idx = 0
    while bytes_num >= 1024.0 and idx < len(units) - 1:
        bytes_num /= 1024.0
        idx += 1
    return f"{bytes_num:3.1f}{units[idx]}"


def human_time(seconds) -> str:
    if seconds is None:
        return "N/A"
    try:
        seconds = int(seconds)
    except Exception:
        return "N/A"
    if seconds < 0:
        return "N/A"
    return str(timedelta(seconds=seconds))


class CLIDownloader:
    def __init__(
        self,
        outdir: str,
        fmt_choice: str,
        allow_playlist=False,
        quiet=False,
        cookies=None,
        use_aria2=False,
        concurrent_fragments=4,
        http_chunk_size=4 * 1024 * 1024,
        socket_timeout=30,
    ):
        """
        Parameters:
          - use_aria2: if True, set yt-dlp to use external_downloader 'aria2c' (must be installed)
          - concurrent_fragments: suggested concurrent fragment downloads (if supported by yt-dlp)
          - http_chunk_size: larger chunk size (bytes) often speeds downloads
        """
        self.outdir = outdir
        self.format_choice = fmt_choice
        self.allow_playlist = allow_playlist
        self.quiet = bool(quiet)
        self.cookies = cookies
        self.use_aria2 = bool(use_aria2)
        self.concurrent_fragments = int(concurrent_fragments or 0)
        self.http_chunk_size = int(http_chunk_size or 0)
        self.socket_timeout = int(socket_timeout or 30)
        self.last_line_len = 0

        # Base options
        self.ydl_opts = {
            "format": format_selector(fmt_choice),
            "outtmpl": os.path.join(self.outdir, "%(title)s.%(ext)s"),
            "progress_hooks": [self._progress_hook],
            "noplaylist": not self.allow_playlist,
            "no_warnings": self.quiet,
            "quiet": self.quiet,
            "retries": 5,
            "http_headers": {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Referer": "https://www.youtube.com/",
            },
            # connection tuning
            "socket_timeout": self.socket_timeout,
            "http_chunk_size": self.http_chunk_size,
        }
        if self.cookies:
            self.ydl_opts["cookiefile"] = self.cookies

        # Concurrent fragment downloads (modern yt-dlp supports this; if not, it's ignored)
        if self.concurrent_fragments and self.concurrent_fragments > 1:
            self.ydl_opts["concurrent_fragment_downloads"] = self.concurrent_fragments

        # Prefer ffmpeg to handle HLS fragments (helps some 403/fragment issues)
        self.ydl_opts["hls_prefer_ffmpeg"] = True
        self.ydl_opts["hls_prefer_native"] = False
        self.ydl_opts["allow_unplayable_formats"] = True
        self.ydl_opts["geo_bypass"] = True
        # larger extraction retries
        self.ydl_opts["extractor_retries"] = 3

        # aria2 config (if requested)
        if self.use_aria2:
            # requires aria2c installed on system
            # -x16: 16 connections per server, -s16: split into 16 segments, --allow-overwrite=true optional
            self.ydl_opts["external_downloader"] = "aria2c"
            self.ydl_opts["external_downloader_args"] = [
                "-x",
                "16",
                "-s",
                "16",
                "--min-split-size=1M",
                "--allow-overwrite=true",
                # optionally add --max-connection-per-server=16 if aria2 supports it on your version
            ]

    def _progress_hook(self, d):
        status = d.get("status")
        if status == "downloading":
            downloaded = d.get("downloaded_bytes") or d.get("downloaded") or 0
            total = d.get("total_bytes") or d.get("total_bytes_estimate") or 0
            speed = d.get("speed") or 0.0
            eta = d.get("eta")
            percent = (downloaded / total * 100.0) if total else None

            if percent is not None:
                line = (
                    f"[{os.getpid()}] Downloading: {percent:5.1f}% | "
                    f"{human_readable_size(downloaded)}/{human_readable_size(total)} | "
                    f"{human_readable_size(speed)}/s | ETA: {human_time(eta)}"
                )
            else:
                line = (
                    f"[{os.getpid()}] Downloading: {human_readable_size(downloaded)} downloaded | "
                    f"{human_readable_size(speed)}/s | ETA: {human_time(eta)}"
                )
            self._print_inline(line)
        elif status == "finished":
            filename = d.get("filename", "")
            self._print_inline("Finished -> " + os.path.basename(filename))
            sys.stdout.write("\n")
            sys.stdout.flush()
            self.last_line_len = 0
        elif status == "error":
            self._print_inline("Error in download.\n")

    def _print_inline(self, text: str):
        if self.quiet:
            return
        # Note: with parallel downloads, lines may interleave. Prefix with PID to help identify.
        sys.stdout.write("\r" + text + " " * max(0, self.last_line_len - len(text)))
        sys.stdout.flush()
        self.last_line_len = len(text)

    def _single_download(self, url: str):
        """
        Perform download for a single URL using a fresh YoutubeDL instance.
        This method is safe to call concurrently from multiple threads.
        """
        # copy base options to avoid cross-thread mutation
        opts = dict(self.ydl_opts)
        # ensure progress_hooks refer to this instance's hook
        opts["progress_hooks"] = [self._progress_hook]

        # Ensure outtmpl uses this downloader's outdir (in case changed)
        opts["outtmpl"] = os.path.join(self.outdir, "%(title)s.%(ext)s")

        # Attempt primary download
        try:
            with ytdl.YoutubeDL(opts) as ydl:
                ydl.download([url])
            return (url, True, None)
        except DownloadError as e:
            return (url, False, e)
        except Exception as e:
            return (url, False, e)

    def _download_with_fallbacks(self, url: str):
        """
        Try primary download; on 403 or failure, try fallbacks:
          1) fallback opts: format="best", increase retries, ffmpeg hls (already set)
          2) final diagnostic retry with minimal opts and quiet=False (to show details)
        Returns (url, success_bool, exception_or_None)
        """
        # Primary attempt
        url, ok, exc = self._single_download(url)
        if ok:
            return (url, True, None)

        # Inspect exception message for 403
        exc_str = str(exc) if exc is not None else ""
        if "HTTP Error 403" in exc_str or "403" in exc_str:
            if not self.quiet:
                print(f"\n⚠️ 403 detected for {url} — trying fallbacks...")

            # Fallback options
            fb_opts = dict(self.ydl_opts)
            fb_opts.update({
                "format": "best",
                "retries": max(fb_opts.get("retries", 3), 6),
                "hls_prefer_ffmpeg": True,
                "hls_prefer_native": False,
                "allow_unplayable_formats": True,
                # keep cookies if present
            })
            # keep http headers and cookiefile
            try:
                with ytdl.YoutubeDL(fb_opts) as fb_ydl:
                    fb_ydl.download([url])
                return (url, True, None)
            except Exception as e2:
                if not self.quiet:
                    print(f"Fallback attempt failed for {url}: {e2}")
                    traceback.print_exc()

        # Final diagnostic retry (less quiet so user sees what's happening)
        try:
            diag_opts = {
                "format": "best",
                "outtmpl": os.path.join(self.outdir, "%(title)s.%(ext)s"),
                "quiet": False if not self.quiet else True,
                "no_warnings": True,
                "noplaylist": not self.allow_playlist,
                "hls_prefer_ffmpeg": True,
                "allow_unplayable_formats": True,
                "geo_bypass": True,
                "socket_timeout": self.socket_timeout,
                "http_chunk_size": self.http_chunk_size,
                "http_headers": {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    "Referer": "https://www.youtube.com/",
                },
            }
            if self.cookies:
                diag_opts["cookiefile"] = self.cookies
            if self.use_aria2:
                diag_opts["external_downloader"] = "aria2c"
                diag_opts["external_downloader_args"] = ["-x", "16", "-s", "16", "--min-split-size=1M"]

            with ytdl.YoutubeDL(diag_opts) as diag_ydl:
                diag_ydl.download([url])
            return (url, True, None)
        except Exception as final_e:
            if not self.quiet:
                print(f"All attempts failed for {url}: {final_e}")
                traceback.print_exc()
            return (url, False, final_e)

    def download(self, urls: List[str], parallel: int = 1):
        """
        Download list of URLs. If parallel>1, run up to that many concurrent workers.
        Returns list of (url, success_bool, exception_or_None)
        """
        results = []
        if parallel <= 1:
            for u in urls:
                if not u or not u.strip():
                    continue
                u = u.strip()
                print(f"\nStarting: {u}")
                res = self._download_with_fallbacks(u)
                results.append(res)
            return results

        # Run in ThreadPoolExecutor; each thread uses the same CLIDownloader instance but creates its own YoutubeDL
        with ThreadPoolExecutor(max_workers=parallel) as exe:
            futures = {exe.submit(self._download_with_fallbacks, u.strip()): u for u in urls if u and u.strip()}
            for fut in as_completed(futures):
                u = futures[fut]
                try:
                    res = fut.result()
                except Exception as e:
                    res = (u, False, e)
                results.append(res)
        return results


def parse_args():
    p = argparse.ArgumentParser(description="Fast CLI YouTube downloader (yt-dlp backend).")
    p.add_argument("urls", nargs="*", help="YouTube URL(s). If omitted, you'll be prompted to paste URLs.")
    p.add_argument("--resolution", "-r", default="1440p",
                   choices=["360p", "480p", "720p", "1080p", "1440p", "2160p", "best", "audio"],
                   help="Desired resolution/format. 'best' = best single-file, 'audio' = audio only.")
    p.add_argument("--outdir", "-o", default="~/Downloads",
                   help="Output directory for downloaded files. Defaults to ~/Downloads.")
    p.add_argument("--yes", "-y", action="store_true", help="Non-interactive; assume yes for prompts.")
    p.add_argument("--quiet", action="store_true", help="Less verbose console output.")
    p.add_argument("--batch-file", "-b", help="Path to a text file with one URL per line.")
    p.add_argument("--allow-playlist", action="store_true",
                   help="Allow downloading full playlists when a playlist URL is provided.")
    p.add_argument("--cookies", "-c", help="Path to cookies file to be used by yt-dlp for downloads.")
    p.add_argument("--use-aria2", action="store_true",
                   help="If set and aria2c is installed, use aria2 to speed fragment downloads.")
    p.add_argument("--parallel", type=int, default=1,
                   help="Number of concurrent downloads (default 1). Use with care; console output may interleave.")
    p.add_argument("--concurrent-fragments", type=int, default=4,
                   help="Number of concurrent fragment downloads per video (if supported by yt-dlp).")
    p.add_argument("--http-chunk-size-mb", type=int, default=4,
                   help="HTTP chunk size in MB (default 4). Larger can improve throughput on good connections.")
    return p.parse_args()


def main():
    args = parse_args()

    # collect URLs
    urls = []
    if args.batch_file:
        if not os.path.isfile(args.batch_file):
            print(f"Batch file '{args.batch_file}' not found.")
            sys.exit(1)
        with open(args.batch_file, "r", encoding="utf-8") as fh:
            urls.extend([line.strip() for line in fh if line.strip()])

    if args.urls:
        urls.extend(args.urls)

    # If piped input (not a TTY), read from stdin
    if not sys.stdin.isatty():
        stdin_text = sys.stdin.read()
        if stdin_text:
            urls.extend([line.strip() for line in stdin_text.splitlines() if line.strip()])

    if not urls:
        try:
            raw = input("Paste one or more YouTube URLs (comma or newline separated):\n")
            if not raw.strip():
                print("No URLs provided. Exiting.")
                sys.exit(0)
            parts = [p.strip() for part in raw.split(",") for p in part.split() if p.strip()]
            urls.extend(parts)
        except KeyboardInterrupt:
            print("\nCancelled.")
            sys.exit(0)

    # dedupe preserving order
    final_urls, seen = [], set()
    for u in urls:
        if u not in seen:
            final_urls.append(u)
            seen.add(u)

    outdir = os.path.abspath(os.path.expanduser(args.outdir))
    os.makedirs(outdir, exist_ok=True)

    if not args.quiet:
        print(f"Output directory: {outdir}")
        print(f"Format choice: {args.resolution}")
        print(f"URLs to download: {len(final_urls)}")
        print(f"Parallel downloads: {args.parallel}")
        if args.use_aria2:
            print("Using external downloader: aria2 (ensure aria2c is installed)")

    if not args.yes:
        try:
            if not args.quiet:
                cont = input("Proceed? [Y/n]: ").strip().lower()
                if cont not in ("", "y", "yes"):
                    print("Aborted.")
                    sys.exit(0)
        except KeyboardInterrupt:
            print("\nCancelled.")
            sys.exit(0)

    # instantiate downloader
    dl = CLIDownloader(
        outdir=outdir,
        fmt_choice=args.resolution,
        allow_playlist=args.allow_playlist,
        quiet=args.quiet,
        cookies=args.cookies,
        use_aria2=args.use_aria2,
        concurrent_fragments=args.concurrent_fragments,
        http_chunk_size=args.http_chunk_size_mb * 1024 * 1024,
        socket_timeout=30,
    )

    results = dl.download(final_urls, parallel=max(1, args.parallel))

    # summary
    success = [r for r in results if r[1]]
    failed = [r for r in results if not r[1]]
    print(f"\nSummary: {len(success)} succeeded, {len(failed)} failed.")
    if failed:
        print("Failed items:")
        for u, ok, exc in failed:
            print(f" - {u}: {exc}")

if __name__ == "__main__":
    main()
