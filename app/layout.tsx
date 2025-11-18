import "./globals.css";
import { Analytics } from "@/utility/analytics/analyticsScript";
import { AuthProvider } from "@/components/AuthProvider";
import { SeoContent } from "@/content/SeoContent";
import { generateMetadata } from "@/utility/generateMetadata";

export const metadata = generateMetadata(SeoContent.baseSeo);

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html suppressHydrationWarning lang="en">
            <head>
                <Analytics />
            </head>
            <body className="bg-white text-black dark:bg-dark dark:text-white">
             
                    <main className="min-h-[82.5vh]">
                        <AuthProvider>{children}</AuthProvider>
                    </main>         
            </body>
        </html>
    );
}
