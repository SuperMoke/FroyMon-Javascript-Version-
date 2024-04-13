"use client";
import React from "react";
import {
  Navbar,
  Collapse,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuHandler,
  ListItem,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../firebase";

function NavList() {
  const router = useRouter();
  function handleLogout() {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        router.push("/"); // Redirect to the home page after logout
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  }

  return (
    <ul className="my-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Link href="/user">
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 font-medium hover:text-blue-500"
        >
          Home
        </Typography>
      </Link>
      <Link href="/user/user_profile">
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 font-medium hover:text-blue-500"
        >
          Profile
        </Typography>
      </Link>
      <Button onClick={handleLogout}>
        Logout &nbsp;
        <FontAwesomeIcon icon={faRightFromBracket}></FontAwesomeIcon>
      </Button>
    </ul>
  );
}

export default function NavbarComponent() {
  const [openNav, setOpenNav] = React.useState(false);

  const handleWindowResize = () =>
    window.innerWidth >= 960 && setOpenNav(false);
  React.useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <Navbar className="mx-auto max-w-screen-xl px-6 py-3 bg-blue-gray-50">
      <div className="flex items-center justify-between text-blue-gray-900">
        <div className="flex items-center">
          <Image
            src="/froymon_logo.png"
            width={50}
            height={50}
            alt="Logo Picture"
          />
          <Typography
            as="a"
            href="#"
            variant="h5"
            className="ml-2 cursor-pointer py-1.5"
          >
            FroyMon
          </Typography>
        </div>

        <div className="hidden lg:block">
          <NavList />
        </div>
        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <XMarkIcon className="h-6 w-6" strokeWidth={2} />
          ) : (
            <Bars3Icon className="h-6 w-6" strokeWidth={2} />
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>
        <NavList />
      </Collapse>
    </Navbar>
  );
}
