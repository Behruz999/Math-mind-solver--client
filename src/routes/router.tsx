import { Routes, Route } from "react-router-dom";
import { Home } from "../views/home";
import { Second } from "../views/second";
import { Example } from "../views/example";
import { Summary } from "../views/summary";

export const MainRouter = () => {
  return (
    <>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="second" element={<Second />} />
            <Route path="example" element={<Example />} />
            <Route path="summary" element={<Summary />} />
        </Routes>
    </>
  )
}
