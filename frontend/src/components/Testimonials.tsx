"use client";

import React, { useState, useEffect } from "react";
import api from "@/utils/api";
import { useTranslations } from "../hooks/useTranslations";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import Button from "./ui/Button";
import { ChevronLeft, ChevronRight, Star, Quote, Users, Award, TrendingUp } from "lucide-react";

interface Testimonial {
  _id: string;
  clientName: string;
  clientPosition: string;
  clientCompany: string;
  clientImage?: string;
  testimonialText: string;
  rating: number;
  projectTitle?: string;
  projectCategory?: string;
  date: string;
  featured?: boolean;
}

interface SocialProofStats {
  totalClients: number;
  averageRating: number;
  totalProjects: number;
  satisfactionRate: number;
}

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SocialProofStats | null>(null);
  const t = useTranslations();

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await api.get("/testimonials");
        setTestimonials(response.data);
        
        // Fetch social proof stats
        const statsResponse = await api.get("/testimonials/stats");
        setStats(statsResponse.data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        // Fallback data
        setTestimonials([
          {
            _id: "1",
            clientName: "Sarah Johnson",
            clientPosition: "CEO",
            clientCompany: "TechStart Inc.",
            testimonialText: "Working with this developer was an absolute pleasure. They delivered a high-quality e-commerce platform that exceeded our expectations. The attention to detail and technical expertise is outstanding.",
            rating: 5,
            projectTitle: "E-Commerce Platform",
            projectCategory: "Web Development",
            date: "2023-08-15",
            featured: true
          },
          {
            _id: "2",
            clientName: "Michael Chen",
            clientPosition: "Product Manager",
            clientCompany: "InnovateLab",
            testimonialText: "The mobile app development was flawless. Great communication throughout the project, delivered on time, and the final product has received excellent user feedback. Highly recommended!",
            rating: 5,
            projectTitle: "Task Management App",
            projectCategory: "Mobile Development",
            date: "2023-07-22",
            featured: true
          },
          {
            _id: "3",
            clientName: "Emily Rodriguez",
            clientPosition: "Marketing Director",
            clientCompany: "Creative Solutions",
            testimonialText: "The UI/UX design work was exceptional. They understood our brand vision perfectly and created a beautiful, user-friendly interface that our customers love.",
            rating: 5,
            projectTitle: "Brand Website Redesign",
            projectCategory: "UI/UX Design",
            date: "2023-06-10"
          },
          {
            _id: "4",
            clientName: "David Thompson",
            clientPosition: "CTO",
            clientCompany: "DataFlow Systems",
            testimonialText: "Excellent technical consulting services. They helped us optimize our architecture and improve performance significantly. Very knowledgeable and professional.",
            rating: 4,
            projectTitle: "System Architecture Review",
            projectCategory: "Consulting",
            date: "2023-05-18"
          },
          {
            _id: "5",
            clientName: "Lisa Wang",
            clientPosition: "Founder",
            clientCompany: "EcoMarket",
            testimonialText: "The e-commerce solution they built has transformed our business. Sales increased by 40% in the first month. Professional, reliable, and delivers results.",
            rating: 5,
            projectTitle: "Online Marketplace",
            projectCategory: "E-commerce",
            date: "2023-04-25"
          }
        ]);

        setStats({
          totalClients: 50,
          averageRating: 4.9,
          totalProjects: 75,
          satisfactionRate: 98
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-gray-600">{t("Testimonials.loading") || "Loading testimonials..."}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("Testimonials.title") || "What Clients Say"}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("Testimonials.subtitle") || "Don't just take my word for it. Here's what clients have to say about working with me."}
          </p>
        </div>

        {/* Social Proof Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <Card className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats.totalClients}+
              </div>
              <div className="text-sm text-gray-600">
                {t("Testimonials.happyClients") || "Happy Clients"}
              </div>
            </Card>

            <Card className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats.averageRating}/5
              </div>
              <div className="text-sm text-gray-600">
                {t("Testimonials.averageRating") || "Average Rating"}
              </div>
            </Card>

            <Card className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats.totalProjects}+
              </div>
              <div className="text-sm text-gray-600">
                {t("Testimonials.completedProjects") || "Projects Completed"}
              </div>
            </Card>

            <Card className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats.satisfactionRate}%
              </div>
              <div className="text-sm text-gray-600">
                {t("Testimonials.satisfactionRate") || "Satisfaction Rate"}
              </div>
            </Card>
          </div>
        )}

        {/* Main Testimonial Carousel */}
        {testimonials.length > 0 && (
          <div className="relative">
            <Card className="p-8 md:p-12 mb-8 overflow-hidden">
              <div className="absolute top-4 left-4 text-blue-200">
                <Quote className="w-16 h-16" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-6">
                  {renderStars(testimonials[currentIndex].rating)}
                </div>
                
                <blockquote className="text-xl md:text-2xl text-gray-700 text-center mb-8 leading-relaxed">
                  "{testimonials[currentIndex].testimonialText}"
                </blockquote>
                
                <div className="flex items-center justify-center gap-4">
                  {testimonials[currentIndex].clientImage && (
                    <img
                      src={testimonials[currentIndex].clientImage}
                      alt={testimonials[currentIndex].clientName}
                      className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  )}
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 text-lg">
                      {testimonials[currentIndex].clientName}
                    </div>
                    <div className="text-gray-600">
                      {testimonials[currentIndex].clientPosition} at {testimonials[currentIndex].clientCompany}
                    </div>
                    {testimonials[currentIndex].projectTitle && (
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <Badge variant="secondary" size="sm">
                          {testimonials[currentIndex].projectTitle}
                        </Badge>
                        {testimonials[currentIndex].projectCategory && (
                          <Badge variant="info" size="sm">
                            {testimonials[currentIndex].projectCategory}
                          </Badge>
                        )}
                      </div>
                    )}
                    <div className="text-sm text-gray-500 mt-1">
                      {formatDate(testimonials[currentIndex].date)}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Navigation Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={prevTestimonial}
                className="p-2"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              {/* Dots Indicator */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentIndex
                        ? "bg-blue-600"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={nextTestimonial}
                className="p-2"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Featured Testimonials Grid */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            {t("Testimonials.moreReviews") || "More Client Reviews"}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 6).map((testimonial, index) => (
              <Card
                key={testimonial._id}
                className={`p-6 hover:shadow-lg transition-all duration-300 ${
                  index === currentIndex ? "ring-2 ring-blue-500 ring-opacity-50" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {renderStars(testimonial.rating)}
                  </div>
                  {testimonial.featured && (
                    <Badge variant="primary" size="sm">
                      Featured
                    </Badge>
                  )}
                </div>
                
                <p className="text-gray-700 mb-4 line-clamp-3">
                  "{testimonial.testimonialText}"
                </p>
                
                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-900">
                    {testimonial.clientName}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.clientPosition}
                  </div>
                  <div className="text-sm text-blue-600">
                    {testimonial.clientCompany}
                  </div>
                  
                  {testimonial.projectTitle && (
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary" size="sm">
                        {testimonial.projectTitle}
                      </Badge>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <h3 className="text-2xl font-bold mb-4">
              {t("Testimonials.ctaTitle") || "Ready to Join These Happy Clients?"}
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              {t("Testimonials.ctaDescription") || "Let's work together to create something amazing. Get in touch to discuss your project and see how I can help bring your vision to life."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg">
                💬 {t("Testimonials.startProject") || "Start Your Project"}
              </Button>
              <Button variant="ghost" size="lg" className="text-white border-white hover:bg-white hover:text-blue-600">
                📞 {t("Testimonials.scheduleCall") || "Schedule a Call"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
