import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: '✍️',
    title: 'Write or Upload Journals',
    description: 'Write freely or upload PDFs – your thoughts, your way.',
    bgColor: 'bg-chart-1/10',
    iconBg: 'bg-chart-1',
  },
  {
    icon: '🤖',
    title: 'AI Mood Detection',
    description: 'Instantly know how your journal reflects your emotions.',
    bgColor: 'bg-chart-2/10',
    iconBg: 'bg-chart-2',
  },
  {
    icon: '🧠',
    title: 'Smart Insights',
    description: 'Get personalized recommendations for better mental health.',
    bgColor: 'bg-chart-3/10',
    iconBg: 'bg-chart-3',
  },
  {
    icon: '📊',
    title: 'Track Your Progress',
    description: 'See your emotional journey unfold with beautiful charts.',
    bgColor: 'bg-chart-4/10',
    iconBg: 'bg-chart-4',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="bg-muted/30 relative py-16 md:py-20">
      {/* Background Pattern */}
      <div className="from-chart-1/3 to-chart-2/3 absolute inset-0 bg-gradient-to-br via-transparent opacity-50" />

      <div className="relative container mx-auto px-4">
        <div className="mb-12 text-center">
          <div className="bg-secondary text-secondary-foreground inline-flex items-center rounded-full border px-3 py-1 text-sm">
            <span className="mr-2">⚡</span>
            <span>Powerful Features</span>
          </div>

          <h2 className="text-foreground mt-4 mb-4 text-3xl font-bold md:text-4xl">
            Everything You Need for Better Self-Reflection
          </h2>

          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Discover how JournAI transforms your daily journaling into
            meaningful insights
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map(feature => (
            <Card
              key={feature.title}
              className={`bg-card border p-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl ${feature.bgColor}`}
            >
              <CardHeader className="pb-4">
                <div
                  className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${feature.iconBg} text-3xl text-white shadow-lg`}
                >
                  {feature.icon}
                </div>
                <CardTitle className="text-foreground text-xl font-semibold">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Privacy Notice */}
        <div className="bg-card mx-auto mt-12 max-w-3xl rounded-lg border p-6 shadow-lg">
          <h3 className="text-card-foreground mb-3 text-xl font-semibold">
            🔒 Your Privacy is Our Priority
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Your personal thoughts remain secure while our AI provides valuable
            insights to help you understand yourself better.
          </p>
        </div>
      </div>
    </section>
  );
}
