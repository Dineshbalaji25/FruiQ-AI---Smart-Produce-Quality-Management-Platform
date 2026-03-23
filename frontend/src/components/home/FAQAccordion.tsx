import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function FAQAccordion() {
    const faqs = [
        {
            question: "How accurate is FruiQ's formalin detection?",
            answer: "FruiQ is trained on the FruitVision benchmark dataset with 94.8% validation accuracy for formalin treatment detection in unsupported conditions.",
        },
        {
            question: "Can I use FruiQ offline or without an internet connection?",
            answer: "Currently, FruiQ requires a stable internet connection as the imagery is processed by our cloud-based AI in real-time, delivering results in under 3 seconds.",
        },
        {
            question: "Are API endpoints available for wholesale integration?",
            answer: "Yes, we offer batch processing APIs and bulk integrations. Check out our dashboard or contact us for enterprise API documentation.",
        },
        {
            question: "What types of fruit does it support today?",
            answer: "We support over 10 mainstream fruits including apples, bananas, mangoes, and oranges. Our data team adds new produce categories every month.",
        }
    ];

    const [openIdx, setOpenIdx] = useState<number | null>(0);

    const toggle = (idx: number) => {
        if (openIdx === idx) {
            setOpenIdx(null);
        } else {
            setOpenIdx(idx);
        }
    };

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <div className="w-full max-w-4xl mx-auto py-20 px-4">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />

            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
                <p className="mt-4 text-xl text-muted-foreground">Everything you need to know about the product and accuracy.</p>
            </div>

            <div className="space-y-4">
                {faqs.map((faq, idx) => (
                    <div
                        key={idx}
                        className="border border-border bg-card rounded-xl overflow-hidden transition-all duration-200"
                    >
                        <button
                            onClick={() => toggle(idx)}
                            className="w-full flex justify-between items-center p-6 text-left focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            <h3 className="text-lg font-semibold text-foreground pr-8">{faq.question}</h3>
                            <div className="text-muted-foreground flex-shrink-0">
                                {openIdx === idx ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </div>
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${openIdx === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                            <div className="p-6 pt-0 text-muted-foreground leading-relaxed">
                                {faq.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
