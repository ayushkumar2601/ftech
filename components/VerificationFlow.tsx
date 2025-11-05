"use client";

export default function VerificationFlow() {
  const steps = [
    { title: "1. Upload File", desc: "User selects and uploads their document." },
    { title: "2. Hash Generation", desc: "A unique hash is created from the file." },
    { title: "3. Blockchain Check", desc: "We verify if the hash already exists." },
    { title: "4. Verification Result", desc: "User gets confirmation instantly." },
  ];

  return (
    <section className="w-full py-12 flex flex-col items-center text-center">
      <h2 className="text-3xl font-semibold mb-8">How Verification Works</h2>

      <div className="flex flex-col md:flex-row items-center gap-8">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-14 h-14 flex items-center justify-center border rounded-full text-xl font-bold">
              {index + 1}
            </div>
            <p className="mt-3 font-medium">{step.title}</p>
            <p className="text-sm text-gray-500 max-w-[180px]">{step.desc}</p>

            {index !== steps.length - 1 && (
              <div className="hidden md:block w-16 border-t"></div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
