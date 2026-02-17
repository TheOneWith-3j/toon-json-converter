import ConverterPane from '../components/ConverterPane';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
      <header className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
        <h1 className="text-2xl font-bold">JSON ↔ TOON Converter</h1>
        <span className="text-xs font-semibold text-neutral-500">Offline Ready • Serverless • PWA</span>
      </header>
      <ConverterPane />
    </main>
  );
}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className={styles.secondary}
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
