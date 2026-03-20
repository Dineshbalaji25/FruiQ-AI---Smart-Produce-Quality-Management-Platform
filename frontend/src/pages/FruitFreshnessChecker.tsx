import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { CheckCircle, AlertCircle, Info, ArrowRight } from "lucide-react";

export function FruitFreshnessChecker() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "FruiQ AI - Fruit Freshness Checker",
        "url": "https://fruiq-ai.me/fruit-freshness-checker",
        "applicationCategory": "AIApplication",
        "operatingSystem": "All",
        "description": "AI tool to detect fruit freshness instantly using image recognition."
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <Helmet>
                <title>Fruit Freshness Checker Online | FruiQ AI</title>
                <meta
                    name="description"
                    content="Check fruit freshness instantly using AI. Upload an image and find out if your fruit is fresh or rotten."
                />
                <meta
                    name="keywords"
                    content="fruit freshness checker, check fruit quality online, AI fruit freshness India"
                />
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            </Helmet>

            <h1 className="text-4xl font-extrabold text-foreground mb-6 leading-tight">
                Fruit Freshness Checker Using AI
            </h1>

            <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
                <p>
                    Ensuring that fruits are fresh before consumption is important for health.
                    Traditional methods of checking freshness are not always reliable.
                </p>

                <div className="grid md:grid-cols-2 gap-8 my-10 not-prose">
                    <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
                        <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4 text-destructive">
                            <AlertCircle size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-3">Common Problems</h3>
                        <ul className="space-y-2">
                            <li className="flex items-start">
                                <span className="mr-2 text-primary mt-1">•</span>
                                <span>Fruits look fresh but are spoiled inside</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 text-primary mt-1">•</span>
                                <span>Chemical treatments hide defects</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 text-primary mt-1">•</span>
                                <span>Manual inspection is inconsistent</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                            <Info size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-3">AI-Based Solution</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            FruiQ AI uses advanced deep learning to analyze fruit images and determine
                            freshness levels instantly.
                        </p>
                        <div className="mt-4">
                            <Link to="/scan" className="text-primary font-bold inline-flex items-center hover:underline">
                                Check Fruit Now <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-4">
                        <CheckCircle className="text-primary" />
                        Benefits
                    </h2>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                        <li>Instant results with high accuracy</li>
                        <li>Easy to use via mobile browser</li>
                        <li>Works on standard mobile images without special equipment</li>
                    </ul>
                </section>

                <section className="border-t border-border pt-8">
                    <h3 className="text-xl font-bold text-foreground mb-4">Related Quality Tools</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                        <li className="bg-muted/50 p-4 rounded-lg hover:bg-muted transition-colors">
                            <Link to="/detect-rotten-fruits" className="text-primary font-medium hover:underline flex items-center justify-between">
                                Detect Rotten Fruits
                                <ArrowRight size={16} />
                            </Link>
                        </li>
                        <li className="bg-muted/50 p-4 rounded-lg hover:bg-muted transition-colors">
                            <Link to="/formalin-detection-fruits" className="text-primary font-medium hover:underline flex items-center justify-between">
                                Formalin Detection in India
                                <ArrowRight size={16} />
                            </Link>
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
