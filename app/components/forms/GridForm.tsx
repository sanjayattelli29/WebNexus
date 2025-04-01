"use client";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

interface ContactData {
  _id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

interface GridFormProps {
  data: ContactData[];
  onEdit: (item: ContactData) => void;
  onDelete: (id: string) => void;
}

const GridForm: React.FC<GridFormProps> = ({ data, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-[#1e2227] border-b border-gray-700">
            <th className="px-6 py-4 text-sm font-medium text-gray-300">
              NAME
            </th>
            <th className="px-6 py-4 text-sm font-medium text-gray-300">
              EMAIL
            </th>
            <th className="px-6 py-4 text-sm font-medium text-gray-300">
              MESSAGE
            </th>
            <th className="px-6 py-4 text-sm font-medium text-gray-300">
              DATE
            </th>
            <th className="px-6 py-4 text-sm font-medium text-gray-300">
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item._id}
              className="border-b border-gray-700 hover:bg-[#1e2227] transition-colors"
            >
              <td className="px-6 py-4 text-sm text-white">{item.name}</td>
              <td className="px-6 py-4 text-sm text-white">{item.email}</td>
              <td className="px-6 py-4 text-sm text-white max-w-md truncate">
                {item.message}
              </td>
              <td className="px-6 py-4 text-sm text-white">{item.date}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-purple hover:text-purple/80 transition-colors"
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(item._id)}
                    className="text-red-500 hover:text-red-400 transition-colors"
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GridForm;
