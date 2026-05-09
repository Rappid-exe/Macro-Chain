import { NotebookPen, MessageSquare } from "lucide-react";
import { Button } from "@/landing/components/ui/button";
import { WORKFLOW_COPY } from "@/landing/lib/constants";

export default function WorkflowSection() {
  return (
    <section aria-labelledby="workflow-heading" className="py-20 px-6">
      <div className="mx-auto max-w-3xl text-center">
        <h2
          id="workflow-heading"
          className="text-2xl font-semibold text-text-primary mb-4"
        >
          Your Workflow
        </h2>
        <p className="text-text-secondary text-base mb-8">{WORKFLOW_COPY}</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button type="button" variant="secondary" size="default">
            <NotebookPen
              size={18}
              aria-hidden="true"
              className="mr-2 shrink-0"
            />
            Send to Notion
          </Button>
          <Button type="button" variant="secondary" size="default">
            <MessageSquare
              size={18}
              aria-hidden="true"
              className="mr-2 shrink-0"
            />
            Alert Slack
          </Button>
        </div>
      </div>
    </section>
  );
}
