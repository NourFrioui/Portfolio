"use client";

import React, { useState, useEffect } from "react";
import api from "@/utils/api";
import { useTranslations } from "../hooks/useTranslations";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import Button from "./ui/Button";

interface Service {
  _id: string;
  title: string;
  description: string;
  features: string[];
  price?: {
    amount: number;
    currency: string;
    period: string;
  };
  icon?: string;
  category?: string;
  popular?: boolean;
}

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/services");
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
        // Fallback data
        setServices([
          {
            _id: "1",
            title: "Web Development",
            description: "Full-stack web applications with modern technologies and best practices.",
            features: [
              "Responsive design",
              "Performance optimization",
              "SEO-friendly",
              "Cross-browser compatibility",
              "API integration",
              "Database design"
            ],
            price: {
              amount: 500,
              currency: "€",
              period: "day"
            },
            icon: "🌐",
            category: "Development",
            popular: true
          },
          {
            _id: "2",
            title: "Mobile App Development",
            description: "Native and cross-platform mobile applications for iOS and Android.",
            features: [
              "React Native development",
              "Native performance",
              "App Store deployment",
              "Push notifications",
              "Offline functionality",
              "Analytics integration"
            ],
            price: {
              amount: 600,
              currency: "€",
              period: "day"
            },
            icon: "📱",
            category: "Development"
          },
          {
            _id: "3",
            title: "UI/UX Design",
            description: "User-centered design solutions that enhance user experience and engagement.",
            features: [
              "User research",
              "Wireframing & prototyping",
              "Visual design",
              "Usability testing",
              "Design systems",
              "Responsive layouts"
            ],
            price: {
              amount: 400,
              currency: "€",
              period: "day"
            },
            icon: "🎨",
            category: "Design"
          },
          {
            _id: "4",
            title: "Technical Consulting",
            description: "Strategic technical guidance and architecture planning for your projects.",
            features: [
              "Technology assessment",
              "Architecture planning",
              "Code review",
              "Performance audit",
              "Team mentoring",
              "Best practices guidance"
            ],
            price: {
              amount: 300,
              currency: "€",
              period: "day"
            },
            icon: "💡",
            category: "Consulting"
          },
          {
            _id: "5",
            title: "E-commerce Solutions",
            description: "Complete e-commerce platforms with payment integration and inventory management.",
            features: [
              "Custom e-commerce platform",
              "Payment gateway integration",
              "Inventory management",
              "Order processing",
              "Analytics dashboard",
              "Mobile optimization"
            ],
            price: {
              amount: 700,
              currency: "€",
              period: "day"
            },
            icon: "🛒",
            category: "Development"
          },
          {
            _id: "6",
            title: "Maintenance & Support",
            description: "Ongoing maintenance, updates, and technical support for your applications.",
            features: [
              "Bug fixes & updates",
              "Security monitoring",
              "Performance optimization",
              "Backup management",
              "24/7 support",
              "Monthly reports"
            ],
            price: {
              amount: 200,
              currency: "€",
              period: "day"
            },
            icon: "🔧",
            category: "Support"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getServiceIcon = (icon?: string, title?: string) => {
    if (icon) return icon;
    
    const iconMap: { [key: string]: string } = {
      "web": "🌐",
      "mobile": "📱",
      "design": "🎨",
      "consulting": "💡",
      "ecommerce": "🛒",
      "maintenance": "🔧",
      "api": "🔌",
      "database": "🗄️"
    };
    
    const key = title?.toLowerCase() || "";
    for (const [keyword, emoji] of Object.entries(iconMap)) {
      if (key.includes(keyword)) return emoji;
    }
    
    return "💻";
  };

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("Services.title") || "What I Do"}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("Services.subtitle") || "Professional services tailored to bring your ideas to life with cutting-edge technology and exceptional quality."}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-gray-600">{t("Services.loading") || "Loading services..."}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card
                key={service._id}
                className={`group relative overflow-hidden transition-all duration-300 hover:-translate-y-2 ${
                  service.popular ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                }`}
              >
                {service.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 text-xs font-medium rounded-bl-lg">
                    {t("Services.popular") || "Popular"}
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">{getServiceIcon(service.icon, service.title)}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>
                  {service.category && (
                    <Badge variant="secondary" size="sm">
                      {service.category}
                    </Badge>
                  )}
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">
                    {t("Services.features") || "What's included:"}
                  </h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {service.price && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {t("Services.startingAt") || "Starting at"} {service.price.amount}{service.price.currency}
                      </div>
                      <div className="text-sm text-gray-600">
                        per {service.price.period}
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Button className="w-full" size="md">
                    {t("Services.getQuote") || "Get Quote"}
                  </Button>
                  <Button variant="ghost" className="w-full" size="sm">
                    {t("Services.learnMore") || "Learn More"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              {t("Services.ctaTitle") || "Ready to Start Your Project?"}
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              {t("Services.ctaDescription") || "Let's discuss your requirements and create something amazing together. Get in touch for a free consultation."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg">
                📞 {t("Services.scheduleCall") || "Schedule a Call"}
              </Button>
              <Button variant="ghost" size="lg" className="text-white border-white hover:bg-white hover:text-blue-600">
                💬 {t("Services.startChat") || "Start a Conversation"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
