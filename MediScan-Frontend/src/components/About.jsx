import React, { useState } from 'react';

const faqs = [
  {
    question: "What is MediScan?",
    answer: "MediScan is an AI-powered diagnostic tool that allows users to upload a medical image and describe their symptoms. The system analyzes the input and provides potential causes along with medically relevant suggestions."
  },
  {
    question: "How accurate is the diagnosis?",
    answer: "MediScan provides AI-generated insights based on available data, but it is not a replacement for professional medical advice. Always consult a healthcare provider for a confirmed diagnosis."
  },
  {
    question: "What types of images can I upload?",
    answer: "You can upload images of skin conditions, visible injuries, or any external medical symptoms. Make sure the image is clear and high resolution for best results."
  },
  {
    question: "Is my data secure?",
    answer: "Yes. Your uploaded data is handled securely and is only used for the purpose of generating a diagnosis. We do not share any personal information."
  },
  {
    question: "Can MediScan detect internal conditions?",
    answer: "Currently, MediScan is best suited for analyzing visible symptoms and textual descriptions. It is not intended for diagnosing internal health issues like organ damage or internal infections."
  }
];

const steps = [
  {
    title: "1. Upload Your Medical Image",
    description: "Take a clear photo of the affected area (e.g., skin rash, swelling) and upload it using the image field on the MediScan home page."
  },
  {
    title: "2. Describe Your Symptoms",
    description: "Provide a short but detailed description of what you're experiencing—such as pain, redness, itching, or duration of symptoms."
  },
  {
    title: "3. Click ‘Diagnose’",
    description: "Submit the form and let MediScan analyze your inputs. Within seconds, you'll receive AI-generated possible causes and suggestions."
  },
  {
    title: "4. Review the Suggestions",
    description: "Read through the generated health insights. Use them as guidance—but always confirm with a licensed medical professional."
  }
];

const About = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section className="w-full px-6 py-12 bg-white text-gray-800">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-teal-600 mb-4">About MediScan</h1>
        <p className="text-lg text-center text-gray-600 mb-10">
          MediScan is your AI-powered health assistant. Our platform helps users get quick insights by analyzing medical images and symptoms using machine learning. Whether it's a skin rash, swelling, or general symptoms, MediScan guides you with potential diagnoses and medical suggestions.
        </p>

        {/* How to Use MediScan */}
        <h2 className="text-2xl font-semibold mb-6 text-teal-700">How to Use MediScan</h2>
        <ol className="space-y-6 mb-10">
          {steps.map((step, idx) => (
            <li key={idx} className="bg-blue-50 p-5 rounded-xl shadow-sm border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-800 mb-1">{step.title}</h3>
              <p className="text-gray-700">{step.description}</p>
            </li>
          ))}
        </ol>

        {/* FAQ Section */}
        <h2 className="text-2xl font-semibold mb-6 text-teal-700">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex justify-between w-full text-left font-medium text-gray-800"
              >
                {faq.question}
                <span className="text-teal-500">{activeIndex === index ? '-' : '+'}</span>
              </button>
              {activeIndex === index && (
                <p className="mt-3 text-gray-600">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
