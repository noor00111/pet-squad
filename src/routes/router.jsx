import Dashboard from "@/layout/Dashboard";
import MainLayout from "@/layout/MainLayout";
import Login from "@/pages/Auth/Login";
import Registration from "@/pages/Auth/Registration";
import Error404 from "@/pages/Error404";
import Home from "@/pages/Home/Home";
import About from "@/pages/About/About";
import Contact from "@/pages/Contact/Contact";
import {createBrowserRouter} from "react-router-dom";
import AddPets from "@/pages/PrivatePages/Dashboard/AddPets";
import MyAddedPets from "@/pages/PrivatePages/Dashboard/MyAddedPets";
import UpdatePet from "@/pages/PrivatePages/Dashboard/UpdatePet";
import NotAdoptedPetListing from "@/pages/NotAdoptedPetListing/NotAdoptedPetListing";
import PetDetails from "@/pages/PetDetails/PetDetails";
import AdoptionRequest from "@/pages/PrivatePages/Dashboard/AdoptionRequest";
import CreateDonation from "@/pages/PrivatePages/Dashboard/DonationCampaigns/CreateDonation";
import MyDonationCampaigns from "@/pages/PrivatePages/Dashboard/DonationCampaigns/MyDonationCampaigns";
import UpdateDonationCampaign from "@/pages/PrivatePages/Dashboard/DonationCampaigns/UpdateDonationCampaign";
import MyDonation from "@/pages/PrivatePages/Dashboard/DonationCampaigns/MyDonation";
import DonationCampaigns from "@/pages/DonationCampaigns/DonationCampaigns";
import DonationDetails from "@/pages/DonationDetails/DonationDetails";
import UserDashboard from "@/pages/PrivatePages/Dashboard/UserDashboard/UserDashboard";
import AdminDashboard from "@/pages/PrivatePages/Dashboard/AdminDashboard/AdminDashboard";
import AllUsers from "@/pages/PrivatePages/Dashboard/AdminDashboard/AllUsers";
import AllPets from "@/pages/PrivatePages/Dashboard/AdminDashboard/AllPets";
import AllDonations from "@/pages/PrivatePages/Dashboard/AdminDashboard/AllDonations";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import DashboardRedirect from "./DashboardRedirect";
import { API_BASE_URL } from "@/lib/config";
import PetCare from "@/pages/PetCare/PetCare";



export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {
        path: '/',
        element: <Home></Home>
      },
      {
        path: '/about',
        element: <About></About>
      },
      {
        path: '/contact',
        element: <Contact></Contact>
      },
      {
        path: "/petCare",
        element: <PetCare></PetCare>
      },
      {
        path: '/petListing',
        element: <NotAdoptedPetListing></NotAdoptedPetListing>,
        loader: () => fetch(`${API_BASE_URL}/pets/isNotAdopted`)
      },
      {
        path: '/petDetails/:id',
        element: <PetDetails></PetDetails>,
        loader: ({params}) => fetch(`${API_BASE_URL}/pets/${params.id}`)
      },
      {
        path: '/donationCampaigns',
        element: <DonationCampaigns></DonationCampaigns>
      },
      {
        path: '/donationDetails/:id',
        element: <DonationDetails></DonationDetails>
      },
      {
        path: '/login',
        element: <Login></Login>
      },
      {
        path: '/register',
        element: <Registration></Registration>
      }
    ]
  },
  {
    path: 'dashboard',
    element: <PrivateRoute><Dashboard></Dashboard></PrivateRoute>,
    children: [
      {
        index: true,
        element: <DashboardRedirect></DashboardRedirect>
      },
      {
        path: 'user',
        element:<UserDashboard></UserDashboard>
      },
      {
        path: 'addPet',
        element: <AddPets></AddPets>
      },
      {
        path: 'myAddedPets',
        element: <MyAddedPets> </MyAddedPets>
      },
      {
        path: 'updatePet/:id',
        element: <UpdatePet></UpdatePet>,
        loader: ({params}) => fetch(`${API_BASE_URL}/pets/${params.id}`)
      },
      {
        path: 'adoptionRequest',
        element: <AdoptionRequest></AdoptionRequest>
      },
      {
        path: 'createDonationCampaign',
        element: <CreateDonation></CreateDonation>
      },
      {
        path: 'myDonationCampaigns',
        element: <MyDonationCampaigns></MyDonationCampaigns>
      },
      {
        path: 'updateDonationCampaign/:id',
        element: <UpdateDonationCampaign></UpdateDonationCampaign>,
        loader: ({params}) => fetch(`${API_BASE_URL}/donationCampaign/${params.id}`)
      },
      {
        path: 'myDonations',
        element: <MyDonation></MyDonation>
      },

      //---------admin routes------------//
      {
        path: 'admin',
        element:<AdminRoute><AdminDashboard></AdminDashboard></AdminRoute>
      },
      {
        path: 'allUsers',
        element:<AdminRoute><AllUsers></AllUsers></AdminRoute>
      },
      {
        path: 'allPets',
        element:<AdminRoute><AllPets></AllPets></AdminRoute>
      },
      {
        path: 'allDonations',
        element:<AdminRoute><AllDonations></AllDonations></AdminRoute>
      },
    ]
  },
  {
    path: "*",
    element: <Error404></Error404>
  }
]);