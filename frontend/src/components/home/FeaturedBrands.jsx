import React from 'react';
import './FeaturedBrands.css';

// Import leaf image
import decorativeLeaf from '../../assets/images/hero-section/basil-leaf.png';

// Import IT company logos
import cognizant from '../../assets/images/hero-section/logos-section/it-images/congnizant.png';
import hcl from '../../assets/images/hero-section/logos-section/it-images/hcl.png';
import ibm from '../../assets/images/hero-section/logos-section/it-images/ibm.png';
import techMahindra from '../../assets/images/hero-section/logos-section/it-images/techMahindra.png';
import capmine from '../../assets/images/hero-section/logos-section/it-images/capmine.png';
import infosys from '../../assets/images/hero-section/logos-section/it-images/infoses.png';
import tata from '../../assets/images/hero-section/logos-section/it-images/tata.png';
import wipro from '../../assets/images/hero-section/logos-section/it-images/wiproLogo.png';
import amazon from '../../assets/images/hero-section/logos-section/it-images/amazon.png';

// Import Banking/Finance logos
import sbi from '../../assets/images/hero-section/logos-section/banking-logo/sbi-bank.png';
import flipkart from '../../assets/images/hero-section/logos-section/banking-logo/flipkart.png';
import paytm from '../../assets/images/hero-section/logos-section/banking-logo/paytm.png';
import hdfc from '../../assets/images/hero-section/logos-section/banking-logo/hdfc.png';
import icici from '../../assets/images/hero-section/logos-section/banking-logo/ICICI.png';
import bajaj from '../../assets/images/hero-section/logos-section/banking-logo/bajaj.png';
import reliance from '../../assets/images/hero-section/logos-section/banking-logo/Reliance-Retail.png';
import nykaa from '../../assets/images/hero-section/logos-section/banking-logo/nykaa.png';
import bigBasket from '../../assets/images/hero-section/logos-section/banking-logo/big-basket.png';
import googlePay from '../../assets/images/hero-section/logos-section/banking-logo/google-pay.png';
import phonePe from '../../assets/images/hero-section/logos-section/banking-logo/phone-pay.png';
import axis from '../../assets/images/hero-section/logos-section/banking-logo/axis-bank.png';

const itLogos = [
  { id: 1, name: "Cognizant", logo: cognizant },
  { id: 2, name: "HCL", logo: hcl },
  { id: 3, name: "IBM", logo: ibm },
  { id: 4, name: "Tech Mahindra", logo: techMahindra },
  { id: 5, name: "Capmine", logo: capmine },
  { id: 6, name: "Infosys", logo: infosys },
  { id: 7, name: "Tata", logo: tata },
  { id: 8, name: "Wipro", logo: wipro },
  { id: 9, name: "Amazon", logo: amazon }
];

const bankingLogos = [
  { id: 1, name: "SBI Bank", logo: sbi },
  { id: 2, name: "Flipkart", logo: flipkart },
  { id: 3, name: "Paytm", logo: paytm },
  { id: 4, name: "HDFC Bank", logo: hdfc },
  { id: 5, name: "ICICI Bank", logo: icici },
  { id: 6, name: "Bajaj", logo: bajaj },
  { id: 7, name: "Reliance Retail", logo: reliance },
  { id: 8, name: "Nykaa", logo: nykaa },
  { id: 9, name: "Big Basket", logo: bigBasket },
  { id: 10, name: "Google Pay", logo: googlePay },
  { id: 11, name: "PhonePe", logo: phonePe },
  { id: 12, name: "Axis Bank", logo: axis }
];

// Double the arrays for seamless scrolling
const doubledItLogos = [...itLogos, ...itLogos];
const doubledBankingLogos = [...bankingLogos, ...bankingLogos];

const FeaturedBrands = () => {
  return (
    <section className="py-16 bg-[#f8f6f3] overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <div className="text-center mb-12 relative">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-8">
            <span className="text-gray-900">Our Trusted</span>{" "}
            <span className="text-[#7BAD50]">Partners</span>
          </h2>
          {/* Decorative leaf */}
          <img 
            src={decorativeLeaf} 
            alt="" 
            className="w-24 h-auto absolute left-1/2 -translate-x-1/2 -bottom-6 opacity-80"
          />
        </div>
      </div>

      {/* IT Companies Section */}
      <div className="mb-12">
        <div className="scroll-container">
          <div className="scroll-wrapper scroll-right">
            {doubledItLogos.map((brand, index) => (
              <div
                key={`${brand.id}-${index}`}
                className="scroll-item flex items-center justify-center p-4 mx-4"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-h-[60px] w-auto object-contain transition-all duration-300 hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Banking/Finance Section */}
      <div>
        <div className="scroll-container">
          <div className="scroll-wrapper scroll-left">
            {doubledBankingLogos.map((brand, index) => (
              <div
                key={`${brand.id}-${index}-reverse`}
                className="scroll-item flex items-center justify-center p-4 mx-4"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-h-[60px] w-auto object-contain transition-all duration-300 hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBrands; 