import { Heart, AlertCircle, Smile, MessageCircle, Users } from "lucide-react";

export const blogTitle =
  "The Importance of Seeking Help for Mental Health Issues";

export const blogContent = (
  <div className="space-y-8 text-gray-800">
    <p className="text-lg leading-relaxed">
      In today’s world, we often focus so much on our physical health—diet,
      exercise, and fitness—that we forget the importance of our mental
      well-being. Yet, mental health plays an equally crucial role in how we
      think, feel, and act. Ignoring emotional struggles can gradually affect
      every part of our lives, from our work and relationships to our sense of
      self-worth.
    </p>

    <p className="text-lg leading-relaxed">
      Seeking help for mental health issues is not a weakness — it’s an act of
      courage and self-awareness. Whether you’re experiencing anxiety,
      depression, burnout, or even emotional exhaustion, reaching out for
      professional support can help you rediscover balance and peace of mind.
    </p>

    {/* Section 1 */}
    <section>
      <h2 className="text-2xl font-semibold flex items-center gap-2 mb-3">
        <Heart className="text-[#034B44]" /> Why It’s Important to Seek Help
      </h2>
      <ul className="list-disc pl-6 space-y-3">
        <li>
          <strong>Early Support Prevents Escalation:</strong> Many mental health
          challenges start small but grow over time. Early intervention can make
          recovery faster and smoother.
        </li>
        <li>
          <strong>Professional Guidance:</strong> Trained therapists and
          counselors provide tools and coping mechanisms that friends and family
          may not be equipped to offer.
        </li>
        <li>
          <strong>Breaking the Cycle:</strong> Persistent stress or negative
          thinking can become habits. Therapy helps reframe perspectives and
          break harmful patterns.
        </li>
        <li>
          <strong>Improved Emotional Resilience:</strong> With help, individuals
          learn to manage future stress and setbacks more effectively.
        </li>
      </ul>
    </section>

    {/* Section 2 */}
    <section>
      <h2 className="text-2xl font-semibold flex items-center gap-2 mb-3">
        <AlertCircle className="text-[#034B44]" /> Overcoming Common Barriers
      </h2>
      <p className="leading-relaxed mb-4">
        Despite growing awareness, many people still hesitate to seek
        professional help due to:
      </p>
      <ul className="list-disc pl-6 space-y-3">
        <li>
          <strong>Stigma:</strong> Fear of being judged or misunderstood keeps
          many silent.
        </li>
        <li>
          <strong>Denial:</strong> Some people downplay their feelings or
          believe they “should be able to handle it alone.”
        </li>
        <li>
          <strong>Lack of Awareness:</strong> Many don’t realize the resources
          available — from community counseling to online therapy.
        </li>
      </ul>
      <p className="mt-4 leading-relaxed">
        It’s vital to remember that mental health struggles are not a sign of
        weakness, but a part of being human. The first step toward healing often
        begins with a simple conversation.
      </p>
    </section>

    {/* Section 3 */}
    <section>
      <h2 className="text-2xl font-semibold flex items-center gap-2 mb-3">
        <Smile className="text-[#034B44]" /> Benefits of Professional Help
      </h2>
      <ul className="list-disc pl-6 space-y-3">
        <li>
          <strong>Clarity and Self-Understanding:</strong> Therapy helps you
          recognize emotions, triggers, and behavior patterns.
        </li>
        <li>
          <strong>Skill Building:</strong> Learn practical techniques like
          mindfulness, grounding exercises, and stress management.
        </li>
        <li>
          <strong>Relationship Healing:</strong> Better communication and
          emotional balance improve connections with loved ones.
        </li>
        <li>
          <strong>Renewed Hope:</strong> Many patients experience a gradual but
          steady improvement in confidence and purpose.
        </li>
      </ul>
    </section>

    {/* Section 4 */}
    <section>
      <h2 className="text-2xl font-semibold flex items-center gap-2 mb-3">
        <Users className="text-[#034B44]" /> How to Take the First Step
      </h2>
      <ol className="list-decimal pl-6 space-y-3">
        <li>
          <strong>Talk About It:</strong> Open up to someone you trust — a
          friend, partner, or counselor.
        </li>
        <li>
          <strong>Book an Appointment:</strong> Schedule a consultation with a
          mental health professional or psychologist.
        </li>
        <li>
          <strong>Join a Support Group:</strong> Connecting with others facing
          similar challenges reduces isolation.
        </li>
        <li>
          <strong>Practice Self-Care:</strong> Balance rest, nutrition,
          movement, and reflection every day.
        </li>
      </ol>
    </section>

    <p className="text-lg leading-relaxed">
      Healing isn’t linear — some days feel easier, others harder — but every
      step toward seeking help is progress. At{" "}
      <strong>Mibo Mental Hospital</strong>, we believe that no one should walk
      their journey alone. Compassionate care, a safe space, and professional
      guidance can make all the difference.
    </p>

    <blockquote className="border-l-4 border-[#034B44] bg-gray-100 p-4 italic text-gray-700">
      “Asking for help is the first act of strength, not surrender.”
    </blockquote>

    <p className="text-lg leading-relaxed">
      If you or someone you know is struggling, don’t wait — reach out. Healing
      begins the moment you decide you deserve support.
    </p>

    <div className="flex items-center gap-2 text-[#034B44] font-semibold mt-8">
      <MessageCircle /> Let’s normalize seeking help — together.
    </div>
  </div>
);
