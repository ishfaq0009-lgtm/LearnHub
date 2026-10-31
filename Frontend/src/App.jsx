import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Courses from "./Pages/Courses.jsx";
import CourseDetails from "./Pages/CourseDetails.jsx";
import About from "./Pages/About.jsx";
import Contact from "./Pages/Contact.jsx";
import FAQ from "./Pages/FAQ.jsx";
import AdminLogin from "./Pages/AdminLogin.jsx";
import Registration from "./Pages/Registration.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import AdminDashboard from "./Pages/AdminDashboard.jsx";
import AdminMessages from "./Pages/AdminMessages.jsx";
import AdminCourses from "./Pages/AdminCourses.jsx";
import CourseForm from "./Pages/CourseForm.jsx";
import NotFound from "./Pages/NotFound.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/userLogin" element={<AdminLogin />} />
        <Route path="/admin/register" element={<Registration />} />
        <Route path="/Registration" element={<Registration />} />

        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/courses/new" element={<CourseForm />} />
          <Route path="/admin/courses/:id/edit" element={<CourseForm />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
