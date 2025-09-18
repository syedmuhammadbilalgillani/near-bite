"use client";
import axios from "axios";
import { Button } from "@/components/catalyst/button";
import { Heading } from "@/components/catalyst/heading";
import moment from "moment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/catalyst/table";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  PencilIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { InputGroup } from "@/components/catalyst/input";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { Input } from "@/components/catalyst/input";
import { Select } from "@/components/catalyst/select";
import VelcrowLoader from "@/components/VelcrowLoader";
import LoadingButton from "@/components/LoadingButton";
import { useRouter } from "next/navigation";

export default function Products() {
  const router = useRouter();
  const [loading, setloading] = useState(false);
  const [deleteLoading, setdeleteLoading] = useState(false);
  const [announcementsData, setannouncementsData] = useState([]);
  const [searchQuery, setsearchQuery] = useState("");

  useEffect(() => {
    getListAnnouncements();
  }, []);
  const getListAnnouncements = () => {
    setannouncementsData([]);
    setloading(true);
    axios
      .get("/api/announcements")
      .then(function (response) {
        setloading(false);
        setannouncementsData(response?.data?.announcements);
      })
      .catch(function (error) {
        setloading(false);
        console.log(error);
      });
  };

  const deleteItem = async (announcementsid: number) => {
    setdeleteLoading(true);
    axios
      .delete(`/api/announcements/${announcementsid}`)
      .then(function (response) {
        setdeleteLoading(false);
        getListAnnouncements();
        toast.success("Announcements has been deleted!");
      })
      .catch(function (error) {
        setdeleteLoading(false);
        console.log(error);
      });
  };

  const handleSearch = async () => {
    setannouncementsData([]);
    setloading(true);
    axios
      .get(
        `/api/announcements/search?term=${encodeURIComponent(searchQuery || "")}`,
      )
      .then(function (response) {
        setloading(false);
        // console.log(response, "result");
        setannouncementsData(response.data.announcements);
      })
      .catch(function (error) {
        setloading(false);
        console.log(error);
      });
  };
  // console.log(announcementsData, "announcements");

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          <Heading>Announcements</Heading>
          <div className="mt-4 flex max-w-xl gap-4">
            <div className="flex-1">
              <InputGroup>
                <MagnifyingGlassIcon />
                <Input
                  name="search"
                  placeholder="Search products&hellip;"
                  onChange={(e) => setsearchQuery(e.target.value)}
                  value={searchQuery}
                />
              </InputGroup>
            </div>
            <Button onClick={handleSearch}>Search</Button>
            <Button
              outline
              onClick={() => {
                setsearchQuery("");
                getListAnnouncements();
              }}
            >
              Reset
            </Button>
          </div>
        </div>
        <Button href="/Announcements/create" className="-my-0.5">
          <PlusCircleIcon />
          Add New Announcements
        </Button>
      </div>
      <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Announcement Title</TableHeader>
            <TableHeader>Company Name</TableHeader>
            <TableHeader>Content</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Start Date</TableHeader>
            <TableHeader>End Date</TableHeader>
            <TableHeader>Date Created</TableHeader>
            <TableHeader>Action</TableHeader>
          </TableRow>
        </TableHead>

        <TableBody>
          {announcementsData?.map((item: any, index) => (
            <TableRow
              key={item?.announcement?.announcementid}
              href={`${item?.announcement?.announcementid}`}
              title={`Announcement #${item?.announcement?.announcementid}`}
            >
              <TableCell>{item?.announcement?.title}</TableCell>
              <TableCell>{item?.companyName}</TableCell>
              <TableCell>
                {item?.announcement?.content || "No Content"}
              </TableCell>
              <TableCell>
                {item?.announcement?.isactive ? (
                  <span className="me-2 rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                    Active
                  </span>
                ) : (
                  <span className="me-2 rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
                    Inactive
                  </span>
                )}
              </TableCell>
              <TableCell>
                {moment(item?.announcement?.startdate).format("DD-MMM-YYYY")}
              </TableCell>
              <TableCell>
                {moment(item?.announcement?.enddate).format("DD-MMM-YYYY")}
              </TableCell>
              <TableCell className="text-zinc-500">
                <span className="inline-flex items-center rounded border border-blue-400 bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-gray-700 dark:text-blue-400">
                  <svg
                    className="me-1.5 h-2.5 w-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                  </svg>
                  {moment(item?.announcement?.createdat).format("DD-MMM-YYYY")}
                </span>
              </TableCell>
              <TableCell>
                <Button
                  className="cursor-pointer"
                  // loading={deleteLoading}
                  onClick={() => deleteItem(item?.announcement?.announcementid)}
                >
                  {/* {console.log(item?.announcement?.announcementid, "id")} */}
                  <TrashIcon />
                  Delete
                </Button>
                <Button
                  className="mx-2 cursor-pointer"
                  onClick={() =>
                    router.push(
                      `/Announcements/update/${item?.announcement?.announcementid}`,
                    )
                  }
                >
                  <PencilSquareIcon />
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {loading && <VelcrowLoader />}
    </>
  );
}
