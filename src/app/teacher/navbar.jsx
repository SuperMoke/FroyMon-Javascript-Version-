"use client";
import React from "react";
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuHandler,
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

function NavListMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMegaMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <React.Fragment>
      <Menu
        open={isMenuOpen}
        handler={setIsMenuOpen}
        offset={{ mainAxis: 20 }}
        placement="bottom"
        allowHover={true}
      >
        <MenuHandler>
          <Typography as="div" variant="small" className="font-medium">
            <ListItem
              className="flex items-center gap-2 py-2 pr-4 font-medium text-gray-900"
              selected={isMenuOpen}
              onClick={toggleMegaMenu}
            >
              Teacher Actions
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`hidden h-3 w-3 transition-transform lg:block ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
            </ListItem>
          </Typography>
        </MenuHandler>
        <MenuList className="hidden max-w-screen-xl rounded-xl lg:block">
          <ul className="grid grid-cols-2 gap-y-2 outline-none outline-0">
            <Link href="/teacher/teacher_generatelobby">
              <MenuItem className="flex items-center gap-3 rounded-lg">
                <div>
                  <Typography
                    variant="h6"
                    color="blue-gray"
                    className="flex items-center text-sm font-bold"
                  >
                    Generate
                  </Typography>
                  <Typography
                    variant="paragraph"
                    className="text-xs !font-medium text-blue-gray-500"
                  >
                    Generate Virtual Lobby
                  </Typography>
                </div>
              </MenuItem>
            </Link>

            <Link href="/teacher/teacher_viewattendance">
              <MenuItem className="flex items-center gap-3 rounded-lg">
                <div>
                  <Typography
                    variant="h6"
                    color="blue-gray"
                    className="flex items-center text-sm font-bold"
                  >
                    View Attendance
                  </Typography>
                  <Typography
                    variant="paragraph"
                    className="text-xs !font-medium text-blue-gray-500"
                  >
                    Manage the Attendance Form
                  </Typography>
                </div>
              </MenuItem>
            </Link>
          </ul>
        </MenuList>
      </Menu>
    </React.Fragment>
  );
}

function NavList() {
  const router = useRouter();
  function handleLogout() {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        router.push("/"); 
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  }

  return (
    <ul className="my-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Link href="/teacher">
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 font-medium hover:text-blue-500"
        >
          Home
        </Typography>
      </Link>
      <NavListMenu />
      <Link href="/teacher/teacher_profile">
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
            href="/teacher"
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
