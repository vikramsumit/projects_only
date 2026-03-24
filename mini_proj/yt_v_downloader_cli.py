#!/usr/bin/env python3
"""
yt_v_downloader_cli.py

CLI YouTube downloader using yt-dlp.

Features:
 - Accepts one or more YouTube URLs as arguments or interactively.
 - Resolution choices: 360p, 480p, 720p, 1080p, 1440p, 2160p, best, audio
 - Choose output directory
 - Shows progress (percent, speed, ETA) in console using yt-dlp progress hooks
 - Optional browser or cookie-file auth for YouTube bot checks

Dependencies:
    pip install yt-dlp
    ffmpeg must be installed for merging audio+video for many formats.

Examples:
    python yt_v_downloader_cli.py "https://youtu.be/xxxx" --resolution 720p
    python yt_v_downloader_cli.py url1 url2 --outdir /home/user/Downloads
    python yt_v_downloader_cli.py --cookies-from-browser chrome "https://youtu.be/xxxx"
    python yt_v_downloader_cli.py    # will prompt for URL(s)
"""

import argparse
import os
import sys
import traceback
from datetime import timedelta

try:
    import yt_dlp as ytdl
except Exception:
    print("Missing dependency: yt-dlp. Install with: pip install yt-dlp")
    sys.exit(1)


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


def format_selector(choice: str) -> str:
    """Return yt-dlp format selector for a given friendly choice."""
    choice = choice.lower()
    if choice == "360p":
        return "bestvideo[height<=360]+bestaudio/best[height<=360]"
    if choice == "480p":
        return "bestvideo[height<=480]+bestaudio/best[height<=480]"
    if choice == "720p":
        return "bestvideo[height<=720]+bestaudio/best[height<=720]"
    if choice == "1080p":
        return "bestvideo[height<=1080]+bestaudio/best[height<=1080]"
    if choice == "1440p":
        return "bestvideo[height<=1440]+bestaudio/best[height<=1440]"
    if choice == "2160p":
        return "bestvideo[height<=2160]+bestaudio/best[height<=2160]"
    if choice in ("best", "all"):
        return "best"
    if choice == "audio":
        return "bestaudio/best"
    return "best"


# def human_readable_size(bytes_num: int) -> str:
    if not bytes_num:
        return "N/A"
    for unit in ("B", "KB", "MB", "GB", "TB"):
        if bytes_num < 1024.0:
            return f"{bytes_num:3.1f}{unit}"
        bytes_num /= 1024.0
    return f"{bytes_num:.1f}PB"


def human_time(seconds) -> str:
    try:
        seconds = int(seconds)
    except Exception:
        return "N/A"
    return str(timedelta(seconds=seconds))


def build_retry_sleep_functions():
    def backoff(attempt):
        return min(max(1, attempt) * 2, 10)

    return {
        "extractor": backoff,
        "http": backoff,
    }


class CLIDownloader:
    def __init__(
        self,
        outdir: str,
        fmt_choice: str,
        allow_playlist=False,
        quiet=False,
        cookies_from_browser=None,
        cookies_file=None,
    ):
        self.outdir = outdir
        self.format_choice = fmt_choice
        self.allow_playlist = allow_playlist
        self.quiet = quiet
        self.cookies_from_browser = (cookies_from_browser or "").strip().lower()
        self.cookies_file = cookies_file
        self.last_line_len = 0

        self.ydl_opts = {
            "format": format_selector(fmt_choice),
            "outtmpl": os.path.join(self.outdir, "%(title)s.%(ext)s"),
            "progress_hooks": [self._progress_hook],
            "noplaylist": not self.allow_playlist,
            "no_warnings": False,
            "quiet": True,
            "retries": 3,
            "extractor_retries": 5,
            "retry_sleep_functions": build_retry_sleep_functions(),
            "http_headers": dict(DEFAULT_HEADERS),
        }

        if self.cookies_from_browser:
            self.ydl_opts["cookiesfrombrowser"] = (self.cookies_from_browser,)
        elif self.cookies_file:
            self.ydl_opts["cookiefile"] = self.cookies_file

    def _progress_hook(self, data):
        status = data.get("status")
        if status == "downloading":
            downloaded = data.get("downloaded_bytes") or data.get("downloaded") or 0
            total = data.get("total_bytes") or data.get("total_bytes_estimate") or 0
            speed = data.get("speed") or 0.0
            eta = data.get("eta")
            percent = (downloaded / total * 100.0) if total else None

            if percent is not None:
                line = (
                    f"Downloading: {percent:5.1f}% | "
                    f"{human_readable_size(downloaded)}/{human_readable_size(total)} | "
                    f"{human_readable_size(speed)}/s | ETA: {human_time(eta)}"
                )
            else:
                line = (
                    f"Downloading: {human_readable_size(downloaded)} downloaded | "
                    f"{human_readable_size(speed)}/s | ETA: {human_time(eta)}"
                )

            self._print_inline(line)
        elif status == "finished":
            filename = data.get("filename", "")
            self._print_inline("Finished downloading part -> " + os.path.basename(filename))
        elif status == "error":
            self._print_inline("Error in download.")

    def _print_inline(self, text: str):
        sys.stdout.write("\r" + text + " " * max(0, self.last_line_len - len(text)))
        sys.stdout.flush()
        self.last_line_len = len(text)

    def _friendly_error(self, error):
        error_text = str(error)
        lower_error = error_text.lower()

        if "sign in to confirm you're not a bot" in lower_error:
            return (
                "YouTube requested sign-in verification. "
                "Retry with --cookies-from-browser BROWSER or --cookies-file PATH."
            )
        if "ffmpeg is not installed" in lower_error or "ffprobe and ffmpeg not found" in lower_error:
            return "ffmpeg is required to merge audio and video streams. Install ffmpeg and try again."
        return error_text

    def _should_fallback_format(self, error):
        return (
            self.format_choice not in ("best", "all", "audio")
            and "requested format is not available" in str(error).lower()
        )

    def _download_url(self, url, fmt_choice):
        opts = dict(self.ydl_opts)
        opts["format"] = format_selector(fmt_choice)
        with ytdl.YoutubeDL(opts) as ydl:
            info = ydl.extract_info(url, download=False)
            title = info.get("title", url)
            print(f"\nProcessing: {url}")
            print(f"Downloading: {title}")
            ydl.download([url])
            return title

    def download(self, urls):
        try:
            for url in urls:
                if not url.strip():
                    continue

                try:
                    title = self._download_url(url, self.format_choice)
                    print(f"\r\nDownload complete: {title}\n")
                except ytdl.utils.DownloadError as error:
                    if self._should_fallback_format(error):
                        print(
                            f"\nRequested format '{self.format_choice}' is not available for this video."
                        )
                        print("Retrying with best available quality...")
                        try:
                            title = self._download_url(url, "best")
                            print(f"\r\nDownload complete: {title}\n")
                            continue
                        except Exception as fallback_error:
                            print(
                                f"\nError processing {url}:\n  {self._friendly_error(fallback_error)}\n"
                            )
                            if not self.quiet:
                                traceback.print_exc()
                            continue

                    print(f"\nError processing {url}:\n  {self._friendly_error(error)}\n")
                    if not self.quiet:
                        traceback.print_exc()
                except Exception as error:
                    print(f"\nError processing {url}:\n  {self._friendly_error(error)}\n")
                    if not self.quiet:
                        traceback.print_exc()
        except KeyboardInterrupt:
            print("\nInterrupted by user.")
        except Exception as error:
            print(f"\nUnexpected error: {error}")
            if not self.quiet:
                traceback.print_exc()


def parse_args():
    parser = argparse.ArgumentParser(description="Simple CLI YouTube downloader (yt-dlp backend).")
    parser.add_argument("urls", nargs="*", help="YouTube URL(s). If omitted, you'll be prompted to paste URLs.")
    parser.add_argument(
        "--resolution",
        "-r",
        default="1440p",
        choices=["360p", "480p", "720p", "1080p", "1440p", "2160p", "best", "audio"],
        help="Desired resolution/format. 'best' = best single-file, 'audio' = audio only.",
    )
    parser.add_argument(
        "--outdir",
        "-o",
        default="/home/raju/Downloads",
        help="Output directory for downloaded files. Defaults to /home/raju/Downloads.",
    )
    parser.add_argument("--yes", "-y", action="store_true", help="Non-interactive; assume yes for prompts.")
    parser.add_argument("--quiet", action="store_true", help="Less verbose console output.")
    parser.add_argument("--batch-file", "-b", help="Path to a text file with one URL per line.")
    parser.add_argument(
        "--allow-playlist",
        action="store_true",
        help="Allow downloading full playlists when a playlist URL is provided.",
    )
    parser.add_argument(
        "--cookies-from-browser",
        help="Browser to load YouTube cookies from (for example: chrome, firefox, brave).",
    )
    parser.add_argument(
        "--cookies-file",
        help="Path to a cookies.txt file exported in Netscape format.",
    )
    return parser.parse_args()


def main():
    args = parse_args()

    if args.cookies_file and not os.path.isfile(args.cookies_file):
        print(f"Cookies file '{args.cookies_file}' not found.")
        sys.exit(1)

    if args.cookies_from_browser and args.cookies_file:
        print("Using browser cookies and ignoring --cookies-file.")

    urls = []
    if args.batch_file:
        if not os.path.isfile(args.batch_file):
            print(f"Batch file '{args.batch_file}' not found.")
            sys.exit(1)
        with open(args.batch_file, "r", encoding="utf-8") as handle:
            urls.extend([line.strip() for line in handle if line.strip()])

    if args.urls:
        urls.extend(args.urls)

    if not sys.stdin.isatty():
        urls.extend([line.strip() for line in sys.stdin.read().splitlines() if line.strip()])

    if not urls:
        try:
            raw = input("Paste one or more YouTube URLs (comma or newline separated):\n")
            if not raw.strip():
                print("No URLs provided. Exiting.")
                sys.exit(0)
            urls.extend([url.strip() for part in raw.split(",") for url in part.split() if url.strip()])
        except KeyboardInterrupt:
            print("\nCancelled.")
            sys.exit(0)

    final_urls = []
    seen = set()
    for url in urls:
        if url not in seen:
            final_urls.append(url)
            seen.add(url)

    if not final_urls:
        print("No URLs provided. Exiting.")
        sys.exit(0)

    outdir = os.path.abspath(args.outdir)
    os.makedirs(outdir, exist_ok=True)

    print(f"Output directory: {outdir}")
    print(f"Format choice: {args.resolution}")
    print(f"URLs to download: {len(final_urls)}")
    if args.cookies_from_browser:
        print(f"Browser cookies: {args.cookies_from_browser}")
    elif args.cookies_file:
        print(f"Cookies file: {args.cookies_file}")
    else:
        print("Auth: none (add cookies only if YouTube asks you to sign in)")

    if not args.yes:
        cont = input("Proceed? [Y/n]: ").strip().lower()
        if cont not in ("", "y", "yes"):
            print("Aborted.")
            sys.exit(0)

    downloader = CLIDownloader(
        outdir=outdir,
        fmt_choice=args.resolution,
        allow_playlist=args.allow_playlist,
        quiet=args.quiet,
        cookies_from_browser=args.cookies_from_browser,
        cookies_file=args.cookies_file,
    )
    downloader.download(final_urls)


if __name__ == "__main__":
    main()
