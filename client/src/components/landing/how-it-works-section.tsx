import { Card, CardContent } from '@/components/ui/card';

const steps = [
  {
    number: '1',
    title: 'Write Your Journal',
    description:
      'Use our intuitive editor or upload your PDF. Express yourself freely.',
    icon: '✍️',
    bgColor: 'bg-chart-1/10',
    iconBg: 'bg-chart-1',
  },
  {
    number: '2',
    title: 'AI Analyzes Your Mood',
    description:
      'Our advanced AI reads between the lines to understand your emotional state.',
    icon: '🤖',
    bgColor: 'bg-chart-2/10',
    iconBg: 'bg-chart-2',
  },
  {
    number: '3',
    title: 'Get Personalized Insights',
    description:
      'Receive actionable insights and track your emotional patterns over time.',
    icon: '📊',
    bgColor: 'bg-chart-3/10',
    iconBg: 'bg-chart-3',
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="bg-background relative py-16 md:py-20"
    >
      {/* Background Pattern */}
      <div className="from-chart-3/3 to-chart-4/3 absolute inset-0 bg-gradient-to-br via-transparent opacity-30" />

      <div className="relative container mx-auto px-4">
        <div className="mb-12 text-center">
          <div className="bg-secondary text-secondary-foreground inline-flex items-center rounded-full border px-3 py-1 text-sm">
            <span className="mr-2">🚀</span>
            <span>Simple Process</span>
          </div>

          <h2 className="text-foreground mt-4 mb-4 text-3xl font-bold md:text-4xl">
            How JournAI Works
          </h2>

          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Three simple steps to transform your journaling experience with
            AI-powered insights
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map(step => (
            <div key={step.number} className="relative">
              <Card
                className={`bg-card h-full border p-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl ${step.bgColor}`}
              >
                <CardContent className="p-0 text-center">
                  {/* Step Number & Icon */}
                  <div className="mb-6 flex items-center justify-center space-x-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full ${step.iconBg} text-xl font-bold text-white shadow-lg`}
                    >
                      {step.number}
                    </div>
                    <div className="text-4xl">{step.icon}</div>
                  </div>

                  <h3 className="text-card-foreground mb-3 text-xl font-semibold">
                    {step.title}
                  </h3>

                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
