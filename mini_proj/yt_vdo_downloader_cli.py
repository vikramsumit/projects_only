#!/usr/bin/env python3
"""
yt_downloader_cli.py

CLI YouTube downloader using yt-dlp.

Features:
 - Accepts one or more YouTube URLs as arguments or interactively.
 - Resolution choices: 360p, 480p, 720p, 1080p, best (All), audio
 - Choose output directory
 - Shows progress (percent, speed, ETA) in console using yt-dlp progress hooks

Dependencies:
    pip install yt-dlp
    ffmpeg must be installed for merging audio+video for many formats.

Examples:
    python yt_downloader_cli.py "https://youtu.be/xxxx" --resolution 720p
    python yt_downloader_cli.py url1 url2 --outdir /home/user/Downloads
    python yt_downloader_cli.py    # will prompt for URL(s)
"""

import argparse
import os
import sys
import time
import math
import traceback
from datetime import timedelta

try:
    import yt_dlp as ytdl
except Exception:
    print("Missing dependency: yt-dlp. Install with: pip install yt-dlp")
    sys.exit(1)


def format_selector(choice: str) -> str:
    """Return yt-dlp 'format' selector for a given friendly choice."""
    choice = choice.lower()
    if choice == "360p":
        return "bestvideo[height<=360]+bestaudio/best[height<=360]"
    if choice == "480p":
        return "bestvideo[height<=480]+bestaudio/best[height<=480]"
    if choice == "720p":
        return "bestvideo[height<=720]+bestaudio/best[height<=720]"
    if choice == "1080p":
        return "bestvideo[height<=1080]+bestaudio/best[height<=1080]"
    if choice == "best" or choice == "all":
        return "best"
    if choice == "audio":
        return "bestaudio/best"
    # fallback
    return "best"


def human_readable_size(bytes_num: int) -> str:
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


class CLIDownloader:
    def __init__(self, outdir: str, fmt_choice: str, quiet=False):
        self.outdir = outdir
        self.format_choice = fmt_choice
        self.quiet = quiet
        self.last_line_len = 0

        self.ydl_opts = {
            "format": format_selector(fmt_choice),
            "outtmpl": os.path.join(self.outdir, "%(title)s.%(ext)s"),
            "progress_hooks": [self._progress_hook],
            "noplaylist": False,  # allow playlists; user can pass playlist link if they want
            "no_warnings": True,
            "quiet": True,  # use hooks and print our own messages
            "retries": 3,
            # keep temp files on error? default is fine
        }

    def _progress_hook(self, d):
        status = d.get("status")
        if status == "downloading":
            downloaded = d.get("downloaded_bytes") or d.get("downloaded") or 0
            total = d.get("total_bytes") or d.get("total_bytes_estimate") or 0
            speed = d.get("speed") or 0.0
            eta = d.get("eta")
            percent = (downloaded / total * 100.0) if total else None

            if percent is not None:
                line = f"Downloading: {percent:5.1f}% | {human_readable_size(downloaded)}/{human_readable_size(total)} | " \
                       f"{human_readable_size(speed)}/s | ETA: {human_time(eta)}"
            else:
                # unknown total size
                line = f"Downloading: {human_readable_size(downloaded)} downloaded | {human_readable_size(speed)}/s | ETA: {human_time(eta)}"

            self._print_inline(line)

        elif status == "finished":
            # Part (video or audio) finished; merging or finalizing
            filename = d.get("filename", "")
            self._print_inline("Finished downloading part -> " + os.path.basename(filename))
        elif status == "error":
            self._print_inline("Error in download.")

    def _print_inline(self, text: str):
        # overwrite previous line in console
        sys.stdout.write("\r" + text + " " * max(0, self.last_line_len - len(text)))
        sys.stdout.flush()
        self.last_line_len = len(text)

    def download(self, urls):
        try:
            with ytdl.YoutubeDL(self.ydl_opts) as ydl:
                for url in urls:
                    if not url.strip():
                        continue
                    # show meta/title before download
                    try:
                        info = ydl.extract_info(url, download=False)
                        title = info.get("title", url)
                        print(f"\n\nStarting: {title}")
                        # download single url
                        ydl.download([url])
                        # ensure newline after finishing each url
                        print("\r\nDownload complete.\n")
                    except Exception as e:
                        print(f"\nError processing {url}:\n  {e}\n")
                        traceback.print_exc()
        except KeyboardInterrupt:
            print("\nInterrupted by user.")
        except Exception as e:
            print(f"\nUnexpected error: {e}")
            traceback.print_exc()


def parse_args():
    p = argparse.ArgumentParser(description="Simple CLI YouTube downloader (yt-dlp backend).")
    p.add_argument("urls", nargs="*", help="YouTube URL(s). If omitted, you'll be prompted to paste URLs.")
    p.add_argument("--resolution", "-r", default="720p",
                   choices=["360p", "480p", "720p", "1080p", "best", "audio"],
                   help="Desired resolution/format. 'best' = best single-file, 'audio' = audio only.")
    p.add_argument("--outdir", "-o", default=os.path.expanduser("~"),
                   help="Output directory for downloaded files. Defaults to home directory.")
    p.add_argument("--yes", "-y", action="store_true", help="Non-interactive; assume yes for prompts.")
    p.add_argument("--quiet", action="store_true", help="Less verbose console output.")
    p.add_argument("--batch-file", "-b", help="Path to a text file with one URL per line.")
    return p.parse_args()


def main():
    args = parse_args()

    # collect URLs from args, batch file, or prompt / stdin
    urls = []
    if args.batch_file:
        if not os.path.isfile(args.batch_file):
            print(f"Batch file '{args.batch_file}' not found.")
            sys.exit(1)
        with open(args.batch_file, "r", encoding="utf-8") as fh:
            for line in fh:
                line = line.strip()
                if line:
                    urls.append(line)

    if args.urls:
        urls.extend(args.urls)

    # read from stdin if piped
    if not sys.stdin.isatty():
        piped = sys.stdin.read().strip().splitlines()
        for line in piped:
            line = line.strip()
            if line:
                urls.append(line)

    if not urls:
        # interactive prompt
        try:
            raw = input("Paste one or more YouTube URLs (comma or newline separated):\n")
            # accept comma separated or whitespace separated
            if not raw.strip():
                print("No URLs provided. Exiting.")
                sys.exit(0)
            # split on commas or whitespace
            candidate_urls = [u.strip() for part in raw.split(",") for u in part.split() if u.strip()]
            urls.extend(candidate_urls)
        except KeyboardInterrupt:
            print("\nCancelled.")
            sys.exit(0)

    # final validation: dedupe and preserve order
    seen = set()
    final_urls = []
    for u in urls:
        if u not in seen:
            final_urls.append(u)
            seen.add(u)

    outdir = os.path.abspath(args.outdir)
    if not os.path.isdir(outdir):
        try:
            os.makedirs(outdir, exist_ok=True)
        except Exception as e:
            print(f"Could not create output directory '{outdir}': {e}")
            sys.exit(1)

    print(f"Output directory: {outdir}")
    print(f"Format choice: {args.resolution}")
    print(f"URLs to download: {len(final_urls)}")

    if not args.yes:
        cont = input("Proceed? [Y/n]: ").strip().lower()
        if cont not in ("", "y", "yes"):
            print("Aborted.")
            sys.exit(0)

    downloader = CLIDownloader(outdir=outdir, fmt_choice=args.resolution, quiet=args.quiet)
    downloader.download(final_urls)


if __name__ == "__main__":
    main()
