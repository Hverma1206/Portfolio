import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Pages/Layout";
import Home from "./Pages/Home";
import ErrorPage from "./Pages/ErrorPage";
import Portfolio from "./Pages/Portfolio";
import { ThemeProvider } from "./Services/ThemeContext";

function App() {
	return (
		<>
			<ThemeProvider>
				<BrowserRouter>
					<Routes>
						<Route element={<Layout />}>
						<Route path = '/portfolio' element={<Portfolio />} />
							<Route path='/about' element={<Home />} />
							<Route path='/' element={<Home />} />
							<Route path='*' element={<ErrorPage />} />
						</Route>
					</Routes>
				</BrowserRouter>
			</ThemeProvider>
		</>
	);
}
export default App;
