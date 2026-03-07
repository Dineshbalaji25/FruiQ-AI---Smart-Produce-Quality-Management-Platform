import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { Button } from '../components/common/Button';
import { motion } from 'framer-motion';
import api from '../services/api';

export function Contact() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/contact', formData);
            setSubmitted(true);
            setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to send message. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-300 pb-12">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Contact Us</h2>
            </div>

            <p className="text-muted-foreground text-lg max-w-2xl">
                Have questions about FruiQ AI, need industrial API access, or want to report an issue? Our team is here to help you integrate smart produce tracking into your supply chain.
            </p>

            <div className="grid md:grid-cols-3 gap-8 items-start mt-8">

                {/* Contact Information Cards */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-card border rounded-2xl p-6 shadow-sm hover:border-primary/50 transition-colors flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <Mail className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-bold mb-1">Email Us</h3>
                            <a href="mailto:balajidineshr@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">balajidineshr@gmail.com</a>
                            <p className="text-xs text-muted-foreground mt-1">We aim to reply within 24 hours.</p>
                        </div>
                    </div>

                    <div className="bg-card border rounded-2xl p-6 shadow-sm hover:border-primary/50 transition-colors flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <Phone className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-bold mb-1">Phone</h3>
                            <p className="text-muted-foreground">+91 7259634987</p>
                            <p className="text-xs text-muted-foreground mt-1">Mon-Fri, 9am-5pm PST</p>
                        </div>
                    </div>

                    <div className="bg-card border rounded-2xl p-6 shadow-sm hover:border-primary/50 transition-colors flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <MapPin className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-bold mb-1">Headquarters</h3>
                            <p className="text-muted-foreground">#107,1st cross, Greenwoods layout, Varanasi Md, T.C Palaya<br />Bengaluru, Karnataka 560049</p>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="md:col-span-2 bg-card border rounded-2xl p-8 shadow-sm">
                    {submitted ? (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center py-12 space-y-4">
                            <div className="bg-primary/10 p-4 rounded-full">
                                <CheckCircle className="w-16 h-16 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold">Message Sent!</h3>
                            <p className="text-muted-foreground max-w-md">Thank you for reaching out. A member of our support team will get back to you shortly.</p>
                            <Button className="mt-6" variant="secondary" onClick={() => setSubmitted(false)}>Send Another Message</Button>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full h-11 px-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full h-11 px-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                        placeholder="john@company.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                                <select
                                    id="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full h-11 px-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors appearance-none"
                                >
                                    <option>General Inquiry</option>
                                    <option>Technical Support</option>
                                    <option>API & Bulk Licensing</option>
                                    <option>Feedback & Feature Request</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium">Your Message</label>
                                <textarea
                                    id="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className="w-full p-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-y"
                                    placeholder="How can we help you today?"
                                />
                            </div>

                            {error && <p className="text-sm text-destructive">{error}</p>}

                            <Button type="submit" className="w-full sm:w-auto h-12 px-8" disabled={loading}>
                                {loading ? "Sending..." : (
                                    <>
                                        Send Message
                                        <Send className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
