import React from "react";

const VelcrowLoader = ({ items = 5 }) => {
  return (
    <>
      {Array.from({ length: items }, (_, i) => i + 1).map((number) => {
        return (
          <div
            key={number} // Add a unique key prop
            className="my-2 flex h-10 animate-pulse items-center justify-center rounded-lg border-gray-200 bg-gray-200 dark:border-gray-700 dark:bg-red-800"
          ></div>
        );
      })}
    </>
  );
};

export default VelcrowLoader;
