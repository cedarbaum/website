import {
  BuildingOffice2Icon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

import { GitHubIcon } from "./SocialIcons";

export default function ContactCard() {
  return (
    <>
      <h1 className="text-center font-bold text-2xl mt-8">Sam Cedarbaum</h1>
      <dl className="mt-8 ml-4 space-y-4 text-base leading-7 text-gray-600">
        <div className="flex gap-x-4">
          <dt className="flex-none">
            <span className="sr-only">Telephone</span>
            <EnvelopeIcon
              className="h-7 w-6 text-gray-400"
              aria-hidden="true"
            />
          </dt>
          <dd>
            <a className="hover:text-gray-900" href="mailto:scedarbaum@gmail.com">
              scedarbaum@gmail.com
            </a>
          </dd>
        </div>
        <div className="flex gap-x-4">
          <dt className="flex-none">
            <span className="sr-only">Github</span>
            <GitHubIcon className="h-7 w-6 text-gray-400 fill-gray-400" aria-hidden="true" />
          </dt>
          <dd>
            <a
              className="hover:text-gray-900"
              target="_blank"
              href="https://github.com/cedarbaum"
            >
              @cedarbaum
            </a>
          </dd>
        </div>
        <div className="flex gap-x-4">
          <dt className="flex-none">
            <span className="sr-only">Email</span>
            <BuildingOffice2Icon
              className="h-7 w-6 text-gray-400"
              aria-hidden="true"
            />
          </dt>
          <dd>New York, New York</dd>
        </div>
      </dl>
    </>
  );
}
