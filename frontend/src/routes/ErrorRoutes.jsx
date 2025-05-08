import React from "react";
import {  Route } from "react-router-dom";
import ErrorPage from "../utils/ErrorPage";

export default function ErrorRoutes() {
  return (
    <>
      <Route path="/unauthorized" element={<ErrorPage statusCode={401} />} />
      <Route path="/forbidden" element={<ErrorPage statusCode={403} />} />
      <Route path="/servererror" element={<ErrorPage statusCode={500} />} />
      <Route path="/notfound" element={<ErrorPage statusCode={404} />} />

      <Route path="*" element={<ErrorPage statusCode={404} />} />
    </>
  );
}
