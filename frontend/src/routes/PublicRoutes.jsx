import React from "react";
import { Route } from "react-router-dom";
import Navbar from "./../home-page/home-page-components/Navbar";
import SignInForm from "./../home-page/home-page-components/SignInForm";
import SignUpForm from "./../home-page/home-page-components/SignUpForm";
import AboutUsPage from "./../home-page/home-page-components/landing-page-components/AboutUsPage";
import ContactUsPage from "./../home-page/home-page-components/landing-page-components/ContactUsPage";
import Footer from "../home-page/home-page-components/landing-page-components/Footer";
import HomePage from "../home-page/home-page-components/landing-page-components/HomePage";
import ArticlePage from "../home-page/home-page-components/landing-page-components/ArticlePage";
import LatestArticles from "../home-page/home-page-components/landing-page-components/LatestArticles";

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function PublicRoutes() {
  return (
    <>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="signin" element={<SignInForm />} />
        <Route path="signup" element={<SignUpForm />} />
        <Route path="aboutus" element={<AboutUsPage />} />
        <Route path="contactus" element={<ContactUsPage />} />
        <Route
          path="allarticles"
          element={<LatestArticles allarticles={true} />}
        />
        <Route path="/articles/singlepost/:id" element={<ArticlePage />} />
      </Route>
    </>
  );
}
