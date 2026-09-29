import Image from "next/image";
import Link from "next/link";
export const dynamic = 'force-static';
import { APPIMAGES } from "@/config/config";

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="not-found__banner">
        {/* Mobile & Tablet Image */}
        <Image
          src={APPIMAGES.BG1_MOB}
          alt="Page Not Found"
          fill
          priority
          className="not-found__image not-found__image--mobile"
        />

        {/* Desktop Image */}
        <Image
          src={APPIMAGES.BG1}
          alt="Page Not Found"
          fill
          priority
          className="not-found__image not-found__image--desktop"
        />

        <div className="not-found__overlay">
          <div className="container h-100">
            <div className="row h-100">
              <div className="col-12 h-100">
                <div className="not-found__content">
                  <h1 className="not-found__title">
                    Page Not Found
                  </h1>

                  <Link
                    prefetch={false}
                    href="/"
                    className="not-found__button"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}