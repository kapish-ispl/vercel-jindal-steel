'use client'
import AnimatedCountUp from "@/components/custom-components/AnimatedCountUp";
import CardSlider from "@/components/custom-components/CardSlider";
import CardStackSlider from "@/components/custom-components/CardStackSlider";
import InteractiveMap from "@/components/custom-components/IntractiveMap";
import { MoveRight } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="commonSection-md c-homeSection">
        <div className="container cus-container">
          <div className="row">
            <div className="col-lg-6 col-md-12">
              <div className="hw mb-55">
                <div className="c-heading-65 clr-primary lh-75 cus-width-sm">Building Nations Empowering Communities</div>
              </div>
              <div className="genric__content mb-70">
                <p className="c-content-19">Jindal Steel is one of India&apos;s foremost integrated steel producers, renowned for its scale, efficiency, and commitment to excellence. Operating on a robust mine-to-metal model, the Company leverages captive resources, advanced manufacturing capabilities, and a global distribution network to deliver high-performance steel solutions.</p>
              </div>
              <div className="action-btn">
                <a href="#" className="u-btn">
                  <MoveRight color="#446183" size={45} />
                </a>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="media">
                <CardSlider />
                {/* <CardStackSlider /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="commonSection-md c-homeSection bg-gray pb-0">
        <div className="container cus-container">
          <div className="row">
            <div className="col-12">
              <div className="hw mb-55">
                <div className="c-heading-65 clr-green lh-75">Global Footprint</div>
                <InteractiveMap />
              </div>
            </div>

          </div>
          <div className="listView pb-40">
            <div className="row">
              <div className="col-lg-4 col-md-12">
                <div className="listView__item">
                  <div className="listView__item-media">
                    <Image
                      src='/icon/icon-1.png'
                      alt="icon"
                      width={96}
                      height={96}
                      className="img-fluid u-img" />
                  </div>
                  <div className="listView__item-info">
                    <div className="title clr-blue c-heading-45">
                      <AnimatedCountUp to={1.2} /> {""} MTPA
                    </div>
                    <div className="desc clr-secondry c-content-19">Steel Making Capacity by 2026
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-12">
                <div className="listView__item">
                  <div className="listView__item-media">
                    <Image
                      src='/icon/icon-2.png'
                      alt="icon"
                      width={96}
                      height={96}
                      className="img-fluid u-img" />
                  </div>
                  <div className="listView__item-info">
                    <div className="title c-heading-45 clr-burgundy"><AnimatedCountUp to={2684} /> {""} MW</div>
                    <div className="desc clr-secondry c-content-19">Captive Power Capacity
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-12">
                <div className="listView__item">
                  <div className="listView__item-media">
                    <Image
                      src='/icon/icon-3.png'
                      alt="icon"
                      width={96}
                      height={96}
                      className="img-fluid u-img" />
                  </div>
                  <div className="listView__item-info">
                    <div className="title c-heading-45 clr-peach"><AnimatedCountUp to={20000} />+ {""}</div>
                    <div className="desc clr-secondry c-content-19">Employees
                      Across India
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <div className="commonSection-md c-homeSection__people bg-gray">
        <div className="container cus-container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12">
              <div className="w-100 h-100 d-flex">
                <video loop={true} muted={true} autoPlay={true} playsInline={true} className={`c-homeSection__people-video cus-shadow`}>
                  <source src="https://d2lptvt2jijg6f.cloudfront.net/jspsteelpower20/custom/1710498881ForWebSite1.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="hw mb-40">
                <div className="c-heading-65 clr-green mb-3">People & Culture</div>
                <div className="c-heading-40 clr-secondry">What Makes Us.</div>
              </div>
              <div className="genric__content mb-70">
                <p className="c-content-19">Our strength is not only in the steel we produce, but in the people who bring it to life. Individuals who think ahead, build with purpose and lead with integrity. It’s the choices we make when no one’s watching, the pride we take in getting things right, and the belief that progress is built together.
                  Because the Steel of India is built by the Mettle of India.</p>
              </div>
              <div className="action-btn">
                <a href="#" className="u-btn">
                  <MoveRight color="#446183" size={45} />
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div className="commonSection-md c-homeSection__people v2 pb-0">
        <div className="container cus-container">
          <div className="row align-items-center">
            <div className="col-lg-5 col-md-12">
              <div className="hw mb-35">
                <div className="c-heading-65 clr-primary">Caring Beyond Bounds </div>

              </div>
              <div className="genric__content mb-70">
                <p className="c-content-19 cus-width-md">The Jindal Foundation, reflects our unwavering commitment to inclusive and sustainable community development. The Foundation leads our Corporate Social Responsibility (CSR) efforts, focusing on improving the Human Development Index in areas surrounding our operations and among underprivileged communities across India.</p>
              </div>
              <div className="action-btn">
                <a href="#" className="u-btn">
                  <MoveRight color="#446183" size={45} />
                </a>
              </div>
            </div>
            <div className="col-lg-7 col-md-12">
              <div className="w-100 h-100 d-flex justify-content-center">
                <video loop={true} muted={true} autoPlay={true} playsInline={true} className={`c-homeSection__people-video cus-shadow`}>
                  <source src="https://d2lptvt2jijg6f.cloudfront.net/jspsteelpower20/custom/1710498881ForWebSite1.mp4" type="video/mp4" />
                </video>
              </div>
            </div>


          </div>
          <div className="listView v2 gp-xl">
            <div className="row">
              <div className="col-lg-4 col-md-12">
                <div className="listView__item">
                  <div className="listView__item-info">
                    <div className="title clr-blue c-heading-45"><span className="count"><AnimatedCountUp to={1.2} />+ {""}</span>crore</div>
                    <div className="desc clr-secondry c-content-19">People gained access to clean drinking water
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-12">
                <div className="listView__item">
                  <div className="listView__item-info">
                    <div className="title c-heading-45 clr-burgundy"><span className="count"><AnimatedCountUp to={80} /></span>lakh</div>
                    <div className="desc clr-secondry c-content-19">Individuals anually benefit from safe water access
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-12">
                <div className="listView__item">
                  <div className="listView__item-info">
                    <div className="title c-heading-45 clr-peach"><span className="count"><AnimatedCountUp to={4000} />+</span></div>
                    <div className="desc clr-secondry c-content-19">Toilets constructed and renovated across Odisha, Chhattisgarh and Jharkhand
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <div className="commonSection c-cardView bg-gray">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="hw">
                <div className="c-heading-73 clr-green lh-75 mb-70">Sustainable Wealth Creation</div>
              </div>
              <div className="c-cardView__box">
                <div className="c-cardView__box-item">
                  <div className="card__media mb-55">
                    <Image
                      src='/icon/graph.svg'
                      alt="icon"
                      width={96}
                      height={96}
                      className="img-fluid u-img" />
                  </div>
                  <div className="card__content">
                    <div className="card__content__title">
                      <div className="c-heading-45 mb-4">Performance</div>
                    </div>
                    <ul className="bullet__list">
                      <li className="bullet__list-item">
                        <a href="#" className="bullet__list-item-link c-content-19 clr-secondry">Q4 FY&apos;25 Earnings Conference Call</a>
                      </li>
                      <li className="bullet__list-item">
                        <a href="#" className="bullet__list-item-link c-content-19 clr-secondry">Q4 FY25 Financial Results</a>
                      </li>
                      <li className="bullet__list-item">
                        <a href="#" className="bullet__list-item-link c-content-19 clr-secondry">Q3 FY25 Financial Results</a>
                      </li>
                    </ul>
                    <div className="action-btn mt-30">
                      <a href="#" className="u-btn">
                        <MoveRight color="#446183" size={45} />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="c-cardView__box-item">
                  <div className="card__media mb-55">
                    <Image
                      src='/icon/icon-4.svg'
                      alt="icon"
                      width={96}
                      height={96}
                      className="img-fluid u-img" />
                  </div>
                  <div className="card__content">
                    <div className="card__content__title">
                      <div className="c-heading-45 mb-4">Annual Report</div>
                    </div>
                    <ul className="bullet__list">
                      <li className="bullet__list-item">
                        <a href="#" className="bullet__list-item-link c-content-19 clr-secondry">Annual Report 2023-24</a>
                      </li>
                      <li className="bullet__list-item">
                        <a href="#" className="bullet__list-item-link c-content-19 clr-secondry">Annual Report 2022-23</a>
                      </li>

                    </ul>
                    <div className="action-btn mt-30">
                      <a href="#" className="u-btn">
                        <MoveRight color="#446183" size={45} />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="c-cardView__box-item">
                  <div className="card__media mb-55">
                    <Image
                      src='/icon/icon-5.svg'
                      alt="icon"
                      width={96}
                      height={96}
                      className="img-fluid u-img" />
                  </div>
                  <div className="card__content">
                    <div className="card__content__title">
                      <div className="c-heading-45 mb-4">Press Release</div>
                    </div>
                    <div className="card__content-box">
                      <div className="label mb-1">3 July 2025</div>
                      <div className="desc">Jindal Steel Receives Letter of Intent as Successful Bidder for Roida-l Iron Ore and Manganese Block in Odisha</div>
                      <div className="action-btn mt-30">
                        <a href="#" className="u-btn">
                          <MoveRight color="#446183" size={45} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
