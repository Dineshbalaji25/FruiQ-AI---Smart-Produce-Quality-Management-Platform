import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowRight, AlertTriangle, ShieldCheck, Microscope } from "lucide-react";

export function DetectRottenFruits() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "FruiQ AI - Detect Rotten Fruits",
        "url": "https://fruiq-ai.me/detect-rotten-fruits",
        "applicationCategory": "AIApplication",
        "operatingSystem": "All",
        "description": "AI tool to detect fruit freshness and safety using image recognition."
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <Helmet>
                <title>Detect Rotten Fruits Online using AI | FruiQ AI</title>
                <meta
                    name="description"
                    content="Upload fruit images and detect whether they are fresh or rotten using AI. Free online fruit freshness checker."
                />
                <meta
                    name="keywords"
                    content="detect rotten fruits, fruit freshness checker, AI fruit detection, food quality checker India"
                />
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            </Helmet>

            <h1 className="text-4xl font-extrabold text-foreground mb-6 leading-tight">
                How to Detect Rotten Fruits Using AI
            </h1>

            <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
                <p>
                    Identifying whether a fruit is fresh or rotten is not always easy.
                    Many fruits may look fresh from the outside but are spoiled inside.
                    With advancements in Artificial Intelligence, it is now possible
                    to detect fruit quality using image analysis.
                </p>

                <div className="grid md:grid-cols-2 gap-8 my-10 not-prose">
                    <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
                        <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4 text-destructive">
                            <AlertTriangle size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-3">Why Manual Detection Fails</h3>
                        <ul className="space-y-2">
                            <li className="flex items-start">
                                <span className="mr-2 text-primary mt-1">•</span>
                                <span>Lighting conditions affect color perception</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 text-primary mt-1">•</span>
                                <span>External appearance can be misleading</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 text-primary mt-1">•</span>
                                <span>Chemical treatments may hide spoilage</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                            <Microscope size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-3">How FruiQ AI Works</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            FruiQ AI uses deep learning models trained on thousands of fruit images.
                            When you upload an image, the model analyzes texture, color, and patterns
                            to classify the fruit as fresh, rotten, or potentially unsafe.
                        </p>
                    </div>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 mb-10 text-center not-prose">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Try It Yourself</h2>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Click below to upload your fruit image and check its quality instantly using our advanced AI engine.
                    </p>
                    <Link
                        to="/scan"
                        className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all hover:scale-105 shadow-lg"
                    >
                        Try FruiQ AI Now
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-4">
                        <ShieldCheck className="text-primary" />
                        Why Use AI for Food Safety?
                    </h2>
                    <p>
                        AI-based detection ensures faster and more consistent results compared
                        to manual inspection. It helps consumers make better decisions and
                        reduce food waste.
                    </p>
                </section>

                <section className="border-t border-border pt-8">
                    <h3 className="text-xl font-bold text-foreground mb-4">Related Quality Tools</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                        <li className="bg-muted/50 p-4 rounded-lg hover:bg-muted transition-colors">
                            <Link to="/fruit-freshness-checker" className="text-primary font-medium hover:underline flex items-center justify-between">
                                Fruit Freshness Checker
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
