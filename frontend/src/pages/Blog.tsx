import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Notebook as BookOpen, ArrowRight, Apple, HeartPulse, Search } from "lucide-react";

export function Blog() {
    const posts = [
        {
            title: "How to Detect Rotten Fruits Using AI",
            excerpt: "Many fruits look fresh from the outside but are spoiled inside. Discover how AI detects internal rot via surface patterns.",
            link: "/detect-rotten-fruits",
            category: "AI Technology",
            date: "Oct 2023"
        },
        {
            title: "Fruit Freshness Checker: A Guide to Food Quality",
            excerpt: "Traditional freshness checks are often inaccurate. Learn how machine learning helps you pick the best produce every time.",
            link: "/fruit-freshness-checker",
            category: "Health Tips",
            date: "Oct 2023"
        },
        {
            title: "Formalin Detection in Indian Fruits",
            excerpt: "Hidden chemicals like formalin pose serious health risks. See how FruiQ AI identifies artificially preserved fruits.",
            link: "/formalin-detection-fruits",
            category: "Food Safety",
            date: "Oct 2023"
        }
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <Helmet>
                <title>Blog - Fruit Quality & Food Safety | FruiQ AI</title>
                <meta name="description" content="Learn about AI-based fruit freshness detection, food safety in India, and how to spot rotten produce using the latest technology." />
            </Helmet>

            <div className="text-center mb-16">
                <h1 className="text-5xl font-extrabold text-foreground mb-4">FruiQ <span className="text-primary italic">Insights</span></h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Exploring the intersection of artificial intelligence, food safety, and sustainable nutrition.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {posts.map((post, idx) => (
                    <div key={idx} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col group">
                        <div className="p-8 flex-1">
                            <div className="flex items-center justify-between mb-4">
                                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                                    {post.category}
                                </span>
                                <span className="text-muted-foreground text-sm">{post.date}</span>
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors leading-tight">
                                {post.title}
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {post.excerpt}
                            </p>
                        </div>
                        <div className="p-8 pt-0 mt-auto border-t border-border/50">
                            <Link
                                to={post.link}
                                className="inline-flex items-center text-primary font-bold hover:gap-3 transition-all"
                            >
                                Read More
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            <section className="mt-24 p-12 bg-primary/5 border border-primary/20 rounded-3xl text-center">
                <h2 className="text-3xl font-bold mb-4">Need to check a fruit right now?</h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                    Our AI model is ready to scan your produce. No app download required - works right in your browser.
                </p>
                <div className="flex flex-col sm:row gap-4 justify-center items-center">
                    <Link to="/scan" className="px-10 py-5 bg-primary text-primary-foreground font-black rounded-2xl hover:scale-105 transition-transform shadow-xl">
                        Launch AI Scanner
                    </Link>
                </div>
            </section>
        </div>
    );
}
