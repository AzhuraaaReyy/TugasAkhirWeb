import { useState } from "react";
import { ChevronDown } from "lucide-react";
import FadeSlide from "../../Animations/FadeSlide";
import FadeUp from "../../Animations/FadeUp";
import faqs from "../../../data/faq";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <section
      id="faq"
      className="bg-gradient-to-b from-emerald-100 to-white py-16 px-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
         

          <FadeUp delay={300}>
            <h2 className="mt-4 text-4xl font-bold text-gray-800">
              Pertanyaan Umum Seputar Stunting
            </h2>
          </FadeUp>

          <FadeSlide direction="left" delay={500}>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Kami merangkum berbagai pertanyaan yang sering ditanyakan oleh
              orang tua mengenai stunting, gizi anak, serta cara pencegahannya.
            </p>
          </FadeSlide>
        </div>

        {/* FAQ List */}
        <FadeSlide direction="left" delay={800}>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden transition hover:bg-gray-100 zoom-in "
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center p-5 text-left "
                >
                  <span className="font-semibold text-gray-800 ">
                    {faq.question}
                  </span>

                  <ChevronDown
                    className={`transition-transform duration-300 ${
                      openIndex === index ? "rotate-180 text-emerald-600" : ""
                    }`}
                  />
                </button>

                {openIndex === index && (
                  <div className="px-5 pb-5 text-gray-600">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </FadeSlide>
      </div>
    </section>
  );
};
export default FAQ;
