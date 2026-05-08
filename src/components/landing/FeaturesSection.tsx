import { Card, CardContent } from "@/components/ui/card";

export default function FeaturesSection() {
  return (
    <section className="grid md:grid-cols-3 gap-6 px-8 pb-24">

      <Card className="bg-white/5 border-white/10 text-white">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold">
            Live Tracking
          </h2>

          <p className="text-slate-400 mt-2">
            Track civic issues in real time.
          </p>
        </CardContent>
      </Card>

    </section>
  );
}