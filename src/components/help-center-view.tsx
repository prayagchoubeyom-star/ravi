
'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

const faqs = [
    {
        question: "How do I deposit funds?",
        answer: "Navigate to the 'Deposit' page from your profile. Follow the instructions to transfer funds via UPI and submit the transaction proof. Your balance will be updated once the deposit is approved by an admin."
    },
    {
        question: "How long do withdrawals take?",
        answer: "Withdrawal requests are processed by our team. Once you submit a request, it will be reviewed by an admin. Approved withdrawals are typically processed within 24 hours."
    },
    {
        question: "Is my data secure?",
        answer: "Yes, we prioritize the security of your data. All sensitive information is encrypted, and we follow industry best practices to protect your account."
    },
    {
        question: "How do I place a trade?",
        answer: "From the 'Watchlist' or 'Charts' tab, you can tap on any cryptocurrency to open the trade view. From there, you can select buy or sell, market or limit order, and specify the quantity."
    }
]

export function HelpCenterView() {
    return (
        <div className="p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>Find answers to common questions below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger>{faq.question}</AccordionTrigger>
                                <AccordionContent>
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    )
}
