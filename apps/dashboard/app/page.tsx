import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ThemeImage
          className={styles.logo}
          srcLight="turborepo-dark.svg"
          srcDark="turborepo-light.svg"
          alt="HotSpot SaaS Logo"
          width={180}
          height={38}
          priority
        />
        <h1>HotSpot SaaS Dashboard</h1>
        <p>Portal Cautivo Multi-Tenant para Gestión de Redes WiFi</p>
        
        <ol>
          <li>
            Get started by editing <code>apps/dashboard/app/page.tsx</code>
          </li>
          <li>Configure your database connection with DATABASE_URL</li>
          <li>Run Prisma migrations to setup the database schema</li>
          <li>Start building your multi-tenant WiFi management platform</li>
        </ol>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://github.com/misterfluxec/saaslatam"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="/vercel.svg"
              alt="GitHub logomark"
              width={20}
              height={20}
            />
            View on GitHub
          </a>
          <a
            href="https://turborepo.dev/docs?utm_source"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read Turborepo docs
          </a>
        </div>
        <Button appName="dashboard" className={styles.secondary}>
          Test Dashboard
        </Button>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://github.com/misterfluxec/saaslatam"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Source Code
        </a>
        <a
          href="https://turborepo.dev?utm_source=create-turbo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Powered by Turborepo →
        </a>
      </footer>
    </div>
  );
}
