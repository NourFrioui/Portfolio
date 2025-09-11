"use client";

import React, { useState, useEffect } from "react";
import api from "@/utils/api";
import { toast } from "react-hot-toast";
import { useTranslations } from "../hooks/useTranslations";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import Button from "./ui/Button";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Linkedin,
  Github,
  Twitter,
  Calendar,
  MessageSquare,
} from "lucide-react";

interface UserProfile {
  email?: string;
  phone?: string;
  location?: string;
  availableForWork?: boolean;
  timezone?: string;
  responseTime?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    projectType: "",
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const t = useTranslations();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get("/users/portfolio/public");
        setUserProfile(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Fallback data
        setUserProfile({
          email: "hello@example.com",
          phone: "+1 (555) 123-4567",
          location: "San Francisco, CA",
          availableForWork: true,
          timezone: "PST (UTC-8)",
          responseTime: "Within 24 hours",
          socialLinks: {
            linkedin: "#",
            github: "#",
            twitter: "#",
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Validate form before submission
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setSubmitting(false);
      return;
    }

    try {
      await api.post("/contact", formData);
      toast.success(t("Contact.success") || "Message sent successfully!");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        projectType: "",
      });
      setErrors({});
      setTouched({});
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(
        t("Contact.error") || "Failed to send message. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name =
        t("Contact.formValidation.nameRequired") || "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name =
        t("Contact.formValidation.nameMinLength") ||
        "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email =
        t("Contact.formValidation.emailRequired") || "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email =
        t("Contact.formValidation.emailInvalid") ||
        "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject =
        t("Contact.formValidation.subjectRequired") || "Subject is required";
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject =
        t("Contact.formValidation.subjectMinLength") ||
        "Subject must be at least 5 characters";
    }

    if (!formData.message.trim()) {
      newErrors.message =
        t("Contact.formValidation.messageRequired") || "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message =
        t("Contact.formValidation.messageMinLength") ||
        "Message must be at least 10 characters";
    }

    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });

    // Validate field on blur
    const fieldErrors = validateForm();
    if (fieldErrors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: fieldErrors[name as keyof FormErrors],
      });
    }
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t("Contact.title")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("Contact.discussProject")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            {/* Availability Status */}
            {userProfile?.availableForWork !== undefined && (
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      userProfile.availableForWork
                        ? "bg-green-500 animate-pulse"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {userProfile.availableForWork
                      ? t("Contact.availableForWork") ||
                        "Available for New Projects"
                      : t("Contact.notAvailable") || "Currently Unavailable"}
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">
                  {userProfile.availableForWork
                    ? t("Contact.availableDescription") ||
                      "I'm currently accepting new projects and would love to hear about yours."
                    : t("Contact.notAvailableDescription") ||
                      "I'm currently focused on existing projects but feel free to reach out for future opportunities."}
                </p>
                {userProfile.responseTime && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>
                      {t("Contact.responseTime") || "Response time"}:{" "}
                      {userProfile.responseTime}
                    </span>
                  </div>
                )}
              </Card>
            )}

            {/* Contact Information */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t("Contact.contactInfo") || "Get in Touch"}
              </h3>
              <p className="text-gray-600 mb-6">
                {t("Contact.reachOut") ||
                  "Feel free to reach out through any of these channels."}
              </p>

              {loading ? (
                <div className="space-y-4">
                  <div className="animate-pulse flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                  <div className="animate-pulse flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                  <div className="animate-pulse flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {userProfile?.email && (
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {t("Contact.email") || "Email"}
                        </div>
                        <a
                          href={`mailto:${userProfile.email}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {userProfile.email}
                        </a>
                      </div>
                    </div>
                  )}
                  {userProfile?.phone && (
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <Phone className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {t("Contact.phone") || "Phone"}
                        </div>
                        <a
                          href={`tel:${userProfile.phone}`}
                          className="text-green-600 hover:text-green-800"
                        >
                          {userProfile.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {userProfile?.location && (
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <MapPin className="w-5 h-5 text-purple-600" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {t("Contact.location") || "Location"}
                        </div>
                        <span className="text-gray-700">
                          {userProfile.location}
                        </span>
                        {userProfile.timezone && (
                          <div className="text-sm text-gray-500">
                            {t("Contact.timezone").replace(
                              "{timezone}",
                              userProfile.timezone
                            ) || userProfile.timezone}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Social Links */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium text-gray-900 mb-3">
                  {t("Contact.followMe") || "Follow Me"}
                </h4>
                <div className="flex space-x-4">
                  {userProfile?.socialLinks?.linkedin &&
                    userProfile.socialLinks.linkedin !== "#" && (
                      <a
                        href={userProfile.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        title="LinkedIn"
                      >
                        <Linkedin className="w-4 h-4" />
                        <span className="text-sm font-medium">LinkedIn</span>
                      </a>
                    )}
                  {userProfile?.socialLinks?.github &&
                    userProfile.socialLinks.github !== "#" && (
                      <a
                        href={userProfile.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                        title="GitHub"
                      >
                        <Github className="w-4 h-4" />
                        <span className="text-sm font-medium">GitHub</span>
                      </a>
                    )}
                  {userProfile?.socialLinks?.twitter &&
                    userProfile.socialLinks.twitter !== "#" && (
                      <a
                        href={userProfile.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors"
                        title="Twitter"
                      >
                        <Twitter className="w-4 h-4" />
                        <span className="text-sm font-medium">Twitter</span>
                      </a>
                    )}
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h4 className="font-semibold text-gray-900 mb-4">
                {t("Contact.quickActions") || "Quick Actions"}
              </h4>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="ghost">
                  <Calendar className="w-4 h-4 mr-2" />
                  {t("Contact.scheduleCall") || "Schedule a Call"}
                </Button>
                <Button className="w-full justify-start" variant="ghost">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {t("Contact.startChat") || "Start a Chat"}
                </Button>
              </div>
            </Card>
          </div>

          <Card className="p-8">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t("Contact.sendMessage") || "Send me a message"}
              </h3>
              <p className="text-gray-600">
                {t("Contact.formDescription") ||
                  "Fill out the form below and I'll get back to you as soon as possible."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t("Contact.name") || "Full Name"}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.name && touched.name
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    placeholder={
                      t("Contact.yourName") || "Enter your full name"
                    }
                  />
                  {errors.name && touched.name && (
                    <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t("Contact.email") || "Email Address"}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.email && touched.email
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    placeholder={
                      t("Contact.yourEmail") || "Enter your email address"
                    }
                  />
                  {errors.email && touched.email && (
                    <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="projectType"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t("Contact.projectType") || "Project Type"}
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">
                      {t("Contact.selectProjectType") || "Select project type"}
                    </option>
                    <option value="web-development">
                      {t("Contact.webDevelopment") || "Web Development"}
                    </option>
                    <option value="mobile-app">
                      {t("Contact.mobileApp") || "Mobile App"}
                    </option>
                    <option value="ui-ux-design">
                      {t("Contact.uiUxDesign") || "UI/UX Design"}
                    </option>
                    <option value="consulting">
                      {t("Contact.consulting") || "Consulting"}
                    </option>
                    <option value="other">
                      {t("Contact.other") || "Other"}
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("Contact.subject") || "Subject"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.subject && touched.subject
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder={
                    t("Contact.subjectPlaceholder") || "What's this about?"
                  }
                />
                {errors.subject && touched.subject && (
                  <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.subject}</span>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("Contact.message") || "Message"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
                    errors.message && touched.message
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder={
                    t("Contact.messagePlaceholder") ||
                    "Tell me about your project, goals, timeline, and any specific requirements..."
                  }
                />
                {errors.message && touched.message && (
                  <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.message}</span>
                  </div>
                )}
                <div className="mt-1 text-sm text-gray-500">
                  {formData.message.length}/500 characters
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full"
                  size="lg"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      {t("Contact.sending") || "Sending..."}
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      {t("Contact.send") || "Send Message"}
                    </>
                  )}
                </Button>

                <p className="text-sm text-gray-500 text-center mt-3">
                  {t("Contact.responsePromise") ||
                    "I'll get back to you within 24 hours."}
                </p>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
