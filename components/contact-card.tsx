import { MailIcon, HomeIcon } from "lucide-react";

import { GitHubIcon } from "./icons";

interface ContactCardProps {
  email: string;
  github: string;
  location: string;
}

export default function ContactCard({ email, github, location }: ContactCardProps) {
  return (
    <div className="flex flex-col p-4 rounded-xl border overflow-hidden" >
      <h1 className="font-bold text-2xl text-foreground">Sam Cedarbaum</h1>
      <dl className="mt-4 space-y-4 text-foreground leading-7">
        <div className="flex gap-x-4">
          <dt className="flex-none">
            <span className="sr-only">Email</span>
            <MailIcon
              className="h-7 w-6 text-muted-foreground"
              aria-hidden="true"
            />
          </dt>
          <dd>
            <a
              className="hover:text-muted-foreground"
              href={`mailto:${email}`}
            >
              {email}
            </a>
          </dd>
        </div>
        <div className="flex gap-x-4">
          <dt className="flex-none">
            <span className="sr-only">Github</span>
            <GitHubIcon
              className="h-7 w-6 text-muted-foreground fill-muted-foreground"
              aria-hidden="true"
            />
          </dt>
          <dd>
            <a
              className="hover:text-muted-foreground"
              target="_blank"
              href={github}
            >
              {github}
            </a>
          </dd>
        </div>
        <div className="flex gap-x-4">
          <dt className="flex-none">
            <span className="sr-only">Location</span>
            <HomeIcon className="h-7 w-6 text-muted-foreground" aria-hidden="true" />
          </dt>
          <dd>
            <a
              className="hover:text-muted-foreground"
              target="_blank"
              href="https://goo.gl/maps/nqhdmbqhWo9FMhos8"
            >
              {location}
            </a>
          </dd>
        </div>
      </dl>
    </div>
  );
}
