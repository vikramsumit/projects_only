// Lightbox for displaying larger certificate images and details.
import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import { Certificate } from '../types';
import { FaTimes, FaExternalLinkAlt } from 'react-icons/fa';

interface CertificateLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: Certificate | null;
}

const CertificateLightbox: React.FC<CertificateLightboxProps> = ({ isOpen, onClose, certificate }) => {
  if (!certificate) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-background-light dark:bg-background-dark p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-bold leading-6 text-secondary-light dark:text-secondary-dark mb-4 flex justify-between items-center"
                >
                  {certificate.title}
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 dark:bg-gray-700 px-3 py-2 text-sm font-medium text-text-light dark:text-text-dark hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary-light focus-visible:ring-offset-2"
                    onClick={onClose}
                    aria-label="Close lightbox"
                  >
                    <FaTimes className="h-5 w-5" />
                  </button>
                </Dialog.Title>
                <div className="mt-2">
                  <div className="relative w-full h-80 sm:h-96 md:h-[450px] mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={certificate.image}
                      alt={certificate.title}
                      fill
                      style={{ objectFit: 'contain' }}
                      className="rounded-lg bg-gray-200 dark:bg-gray-700" // Add background for transparent images
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/800x600/EC4899/FFFFFF?text=Certificate';
                      }}
                    />
                  </div>
                  <p className="text-text-light dark:text-text-dark mb-2">
                    <strong>Issuer:</strong> {certificate.issuer}
                  </p>
                  <p className="text-text-light dark:text-text-dark mb-2">
                    <strong>Date:</strong> {certificate.date}
                  </p>
                  {certificate.description && (
                    <p className="text-text-light dark:text-text-dark mb-4">
                      <strong>Description:</strong> {certificate.description}
                    </p>
                  )}
                  {certificate.url && (
                    <div className="flex justify-end mt-4">
                      <a
                        href={certificate.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-secondary-light hover:bg-secondary-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-light"
                      >
                        <FaExternalLinkAlt className="mr-2" /> View Credential
                      </a>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CertificateLightbox;