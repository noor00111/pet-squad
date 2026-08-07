import React from 'react';
import { motion } from 'framer-motion';

const DonatorModal = ({ donators, closeModal }) => {

    const total = donators.reduce((sum, d) => sum + Number(d.donatedAmount || 0), 0);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-bodyFont fixed inset-0 bg-[hsl(265,30%,8%)]/55 backdrop-blur-[2px] flex justify-center items-center z-50"
        >
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-card border border-border p-6 rounded-2xl shadow-xl max-w-md w-full"
        >
         <div className='flex justify-between text-colorPrimary'>
         <h2 className="text-xl font-semibold mb-4 font-headingFont">Donors</h2>
         <h2 className="text-xl font-semibold mb-4 font-headingFont">Amount</h2>
         </div>
         <div className='border-b-2 border-colorSecondary mb-3'></div>
          <ul className="space-y-2">
            {donators.length === 0 ? (
                <li className="py-4 text-center text-muted-foreground">No donations yet for this campaign.</li>
            ) : donators.map((donator) => (
              <li key={donator._id} className="flex justify-between items-center text-foreground">
                <span className="truncate">{donator.donorEmail}</span>
                <span className="font-medium text-colorPrimary shrink-0 ml-3">{Number(donator.donatedAmount || 0).toLocaleString()} </span>
              </li>
            ))}
          </ul>
          {donators.length > 0 && (
            <div className="mt-3 flex justify-between border-t border-border pt-3 text-sm font-bold text-foreground">
                <span>Total raised</span>
                <span>{total.toLocaleString()} </span>
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={closeModal}
            className="mt-4 w-full px-4 py-2 rounded-md bg-colorSecondary text-violet-950 shadow-md transition-colors hover:bg-colorSecondary/90 font-headingFont">
            Close
          </motion.button>
        </motion.div>
      </motion.div>
    );
};

export default DonatorModal;
