#!/usr/bin/env python3
"""
yt_downloader_cli.py

CLI YouTube downloader using yt-dlp.

Features:
 - Accepts one or more YouTube URLs as arguments or interactively.
 - Resolution choices: 360p, 480p, 720p, 1080p, 1440p, 2160p, best, audio
 - Choose output directory
 - Shows progress (percent, speed, ETA) in console using yt-dlp progress hooks
 - Cookie support to avoid bot detection

Dependencies:
    pip install yt-dlp
    ffmpeg must be installed for merging audio+video for many formats.

Examples:
    python yt_downloader_cli.py "https://youtu.be/xxxx" --resolution 720p
    python yt_downloader_cli.py url1 url2 --outdir /home/user/Downloads
    python yt_downloader_cli.py --cookies-from-browser chrome
    python yt_downloader_cli.py    # will prompt for URL(s)
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
    if choice == "1440p":
        return "bestvideo[height<=1440]+bestaudio/best[height<=1440]"
    if choice == "2160p":
        return "bestvideo[height<=2160]+bestaudio/best[height<=2160]"   
    if choice in ("best", "all"):
        return "best"
    if choice == "audio":
        return "bestaudio/best"
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
    def __init__(self, outdir: str, fmt_choice: str, allow_playlist=False, quiet=False, 
                 cookies_from_browser=None, cookies_file=None):
        self.outdir = outdir
        self.format_choice = fmt_choice
        self.allow_playlist = allow_playlist
        self.quiet = quiet
        self.cookies_from_browser = cookies_from_browser
        self.cookies_file = cookies_file
        self.last_line_len = 0

        self.ydl_opts = {
            "format": format_selector(fmt_choice),
            "outtmpl": os.path.join(self.outdir, "%(title)s.%(ext)s"),
            "progress_hooks": [self._progress_hook],
            "noplaylist": not self.allow_playlist,
            "no_warnings": False,  # Changed to False to see warnings
            "quiet": True,
            "retries": 3,
            "extractor_retries": 5,
            "retry_sleep": "extractor",
            "http_headers": {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-us,en;q=0.5",
                "Accept-Encoding": "gzip, deflate",
                "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                "Connection": "keep-alive",
            }
        }

        # Add cookie options if provided
        if self.cookies_from_browser:
            self.ydl_opts["cookiesfrombrowser"] = (self.cookies_from_browser,)
        elif self.cookies_file:
            self.ydl_opts["cookies"] = self.cookies_file

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
                line = f"Downloading: {human_readable_size(downloaded)} downloaded | {human_readable_size(speed)}/s | ETA: {human_time(eta)}"

            self._print_inline(line)

        elif status == "finished":
            filename = d.get("filename", "")
            self._print_inline("Finished downloading: " + os.path.basename(filename))
            print()  # New line after finished download
        elif status == "error":
            self._print_inline("Error in download.")

    def _print_inline(self, text: str):
        # Clear the current line and print new text
        sys.stdout.write("\r" + " " * self.last_line_len)  # Clear previous text
        sys.stdout.write("\r" + text)
        sys.stdout.flush()
        self.last_line_len = len(text)

    def download(self, urls):
        try:
            with ytdl.YoutubeDL(self.ydl_opts) as ydl:
                for url in urls:
                    if not url.strip():
                        continue
                    try:
                        print(f"\nProcessing: {url}")
                        # Extract info first to get title
                        info = ydl.extract_info(url, download=False)
                        title = info.get("title", url)
                        print(f"Downloading: {title}")
                        
                        # Now download
                        ydl.download([url])
                        print(f"\n✓ Download complete: {title}\n")
                    except ytdl.utils.DownloadError as e:
                        if "Sign in to confirm you're not a bot" in str(e):
                            print(f"\n❌ Bot detection error for {url}")
                            print("💡 Solution: Use --cookies-from-browser or --cookies-file option")
                            print("   Example: --cookies-from-browser chrome")
                            print("   Or login to YouTube in your browser and try again later")
                        else:
                            print(f"\n❌ Download error for {url}: {e}")
                    except Exception as e:
                        print(f"\n❌ Error processing {url}: {e}")
                        if not self.quiet:
                            traceback.print_exc()
        except KeyboardInterrupt:
            print("\n\n⏹️  Download interrupted by user.")
        except Exception as e:
            print(f"\n❌ Unexpected error: {e}")
            if not self.quiet:
                traceback.print_exc()


def parse_args():
    p = argparse.ArgumentParser(description="Simple CLI YouTube downloader (yt-dlp backend).")
    p.add_argument("urls", nargs="*", help="YouTube URL(s). If omitted, you'll be prompted to paste URLs.")
    p.add_argument("--resolution", "-r", default="audio",
                   choices=["360p", "480p", "720p", "1080p", "1440p", "2160p", "best", "audio"],
                   help="Desired resolution/format. 'best' = best single-file, 'audio' = audio only.")
    p.add_argument("--outdir", "-o", default="/home/raju/Downloads",
                   help="Output directory for downloaded files. Defaults to /home/raju/Downloads.")
    p.add_argument("--yes", "-y", action="store_true", help="Non-interactive; assume yes for prompts.")
    p.add_argument("--quiet", action="store_true", help="Less verbose console output.")
    p.add_argument("--batch-file", "-b", help="Path to a text file with one URL per line.")
    p.add_argument("--allow-playlist", action="store_true",
                   help="Allow downloading full playlists when a playlist URL is provided.")
    
    # Cookie options
    cookie_group = p.add_argument_group('Cookie options (to avoid bot detection)')
    cookie_group.add_argument("--cookies-from-browser", 
                             help="Browser to get cookies from (e.g., chrome, firefox, brave). "
                                  "You must be logged into YouTube in that browser.")
    cookie_group.add_argument("--cookies-file", 
                             help="Path to cookies file (Netscape format). "
                                  "Use '--cookies-file cookies.txt' if you have exported cookies.")
    
    return p.parse_args()


def main():
    args = parse_args()

    # Check if we have cookie options
    if not args.cookies_from_browser and not args.cookies_file:
        print("⚠️  Note: YouTube may require cookies to avoid bot detection.")
        print("   Use --cookies-from-browser CHROME if you get authentication errors.")
        print()

    # collect URLs
    urls = []
    if args.batch_file:
        if not os.path.isfile(args.batch_file):
            print(f"❌ Batch file '{args.batch_file}' not found.")
            sys.exit(1)
        with open(args.batch_file, "r", encoding="utf-8") as fh:
            urls.extend([line.strip() for line in fh if line.strip()])

    if args.urls:
        urls.extend(args.urls)

    if not sys.stdin.isatty():
        urls.extend([line.strip() for line in sys.stdin.read().splitlines() if line.strip()])

    if not urls:
        try:
            raw = input("Paste one or more YouTube URLs (comma or newline separated):\n")
            if not raw.strip():
                print("❌ No URLs provided. Exiting.")
                sys.exit(0)
            # Split by commas or whitespace
            urls.extend([u.strip() for part in raw.split(",") for u in part.split() if u.strip()])
        except KeyboardInterrupt:
            print("\n⏹️  Cancelled.")
            sys.exit(0)

    # dedupe
    final_urls, seen = [], set()
    for u in urls:
        if u not in seen:
            final_urls.append(u)
            seen.add(u)

    outdir = os.path.abspath(args.outdir)
    os.makedirs(outdir, exist_ok=True)

    print(f"📁 Output directory: {outdir}")
    print(f"🎬 Format choice: {args.resolution}")
    print(f"🔗 URLs to download: {len(final_urls)}")
    if args.cookies_from_browser:
        print(f"🍪 Using cookies from browser: {args.cookies_from_browser}")
    if args.cookies_file:
        print(f"🍪 Using cookies file: {args.cookies_file}")

    if not args.yes and final_urls:
        cont = input("🚀 Proceed? [Y/n]: ").strip().lower()
        if cont not in ("", "y", "yes"):
            print("⏹️  Aborted.")
            sys.exit(0)

    downloader = CLIDownloader(
        outdir=outdir,
        fmt_choice=args.resolution,
        allow_playlist=args.allow_playlist,
        quiet=args.quiet,
        cookies_from_browser=args.cookies_from_browser,
        cookies_file=args.cookies_file
    )

    downloader.download(final_urls)


if __name__ == "__main__":
    main()