import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ShieldAlert, Fingerprint, Microscope, ArrowRight } from "lucide-react";

export function FormalinDetection() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "FruiQ AI - Formalin Detection",
        "url": "https://fruiq-ai.me/formalin-detection-fruits",
        "applicationCategory": "AIApplication",
        "operatingSystem": "All",
        "description": "AI tool to detect formalin and other chemical treatments in fruits."
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <Helmet>
                <title>Formalin Detection in Fruits using AI | FruiQ AI</title>
                <meta
                    name="description"
                    content="Detect possible chemical contamination in fruits using AI. Identify unsafe fruits with FruiQ AI."
                />
                <meta
                    name="keywords"
                    content="formalin detection fruits India, chemical fruits detection AI, food safety AI"
                />
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            </Helmet>

            <h1 className="text-4xl font-extrabold text-foreground mb-6 leading-tight">
                Formalin Detection in Fruits
            </h1>

            <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
                <p>
                    Formalin is sometimes used to preserve fruits artificially, which can be harmful.
                    Detecting it manually is extremely difficult because it is colorless and often odorless when diluted.
                </p>

                <div className="grid md:grid-cols-2 gap-8 my-10 not-prose">
                    <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
                        <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4 text-destructive">
                            <ShieldAlert size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-3">Why It’s Dangerous</h3>
                        <ul className="space-y-2">
                            <li className="flex items-start">
                                <span className="mr-2 text-primary mt-1">•</span>
                                <span>Can cause serious long-term health issues</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 text-primary mt-1">•</span>
                                <span>Not visible to the naked human eye</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 text-primary mt-1">•</span>
                                <span>Affects organ function over time</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                            <Fingerprint size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-3">How AI Helps</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            FruiQ AI analyzes visual patterns like unnatural shine, abnormal texture irregularities,
                            and color saturation to identify potentially treated fruits that don't match natural decay patterns.
                        </p>
                    </div>
                </div>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-4">
                        <Microscope className="text-primary" />
                        Scan Now
                    </h2>
                    <p className="mb-6">
                        Our model has been refined using samples from diverse markets in India to better understand local food safety challenges.
                    </p>
                    <Link
                        to="/scan"
                        className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all hover:scale-105 shadow-lg not-prose"
                    >
                        Scan Your Fruit
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </section>

                <section className="border-t border-border pt-8 mt-12">
                    <h3 className="text-xl font-bold text-foreground mb-4">Related Tools</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                        <li className="bg-muted/50 p-4 rounded-lg hover:bg-muted transition-colors">
                            <Link to="/detect-rotten-fruits" className="text-primary font-medium hover:underline flex items-center justify-between">
                                Detect Rotten Fruits
                                <ArrowRight size={16} />
                            </Link>
                        </li>
                        <li className="bg-muted/50 p-4 rounded-lg hover:bg-muted transition-colors">
                            <Link to="/fruit-freshness-checker" className="text-primary font-medium hover:underline flex items-center justify-between">
                                Fruit Freshness Checker
                                <ArrowRight size={16} />
                            </Link>
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
