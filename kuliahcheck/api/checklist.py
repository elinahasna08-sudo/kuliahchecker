"""API Vercel (Python): menyajikan daftar checklist KuliahCheck sebagai JSON.
Tanpa database. Data cukup diedit di dict DATA di bawah ini."""
import json
from http.server import BaseHTTPRequestHandler

DATA = {
  "base": {
    "Barang di tas": [
      [
        "💻",
        "Laptop & charger"
      ],
      [
        "📚",
        "Buku, modul, atau catatan"
      ],
      [
        "✏️",
        "Alat tulis"
      ],
      [
        "🪪",
        "KTM (kartu mahasiswa)"
      ],
      [
        "💧",
        "Botol minum"
      ],
      [
        "☔",
        "Payung atau jas hujan"
      ]
    ],
    "Tugas & jadwal": [
      [
        "🗓️",
        "Cek jadwal & ruang kelas hari ini"
      ],
      [
        "📝",
        "Tugas selesai dan siap dikumpul"
      ],
      [
        "💬",
        "Cek grup kelas & info dosen"
      ],
      [
        "🔋",
        "HP dan power bank terisi"
      ]
    ],
    "Persiapan diri": [
      [
        "🍳",
        "Sarapan"
      ],
      [
        "🚿",
        "Mandi dan berpakaian rapi"
      ],
      [
        "💊",
        "Obat atau vitamin bila perlu"
      ]
    ],
    "Perjalanan": [
      [
        "💳",
        "Uang atau e-wallet cukup"
      ],
      [
        "🛵",
        "Kendaraan siap: BBM, helm, SIM"
      ],
      [
        "🔒",
        "Pintu dikunci, listrik dimatikan"
      ]
    ]
  },
  "modes": {
    "Kuliah biasa": {},
    "Praktikum": {
      "Barang di tas": [
        [
          "🥼",
          "Jas lab & alat praktikum"
        ],
        [
          "📘",
          "Modul dan laporan praktikum"
        ]
      ]
    },
    "Ujian": {
      "Barang di tas": [
        [
          "🎫",
          "Kartu ujian"
        ],
        [
          "🖊️",
          "Pulpen cadangan & pensil 2B"
        ],
        [
          "🧮",
          "Kalkulator (jika diizinkan)"
        ]
      ],
      "Tugas & jadwal": [
        [
          "📖",
          "Baca ulang ringkasan materi"
        ]
      ]
    }
  }
}


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        body = json.dumps(DATA, ensure_ascii=False).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "public, s-maxage=3600")
        self.end_headers()
        self.wfile.write(body)
