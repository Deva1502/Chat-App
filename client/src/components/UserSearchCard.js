import React from 'react';
import Avatar from './Avatar';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const UserSearchCard = ({ user, onClose, index }) => {
    return (
        <motion.div
            initial={{ 
                opacity: 0,
                y: 20,
                rotateX: -45,
                scale: 0.9
            }}
            animate={{ 
                opacity: 1,
                y: 0,
                rotateX: 0,
                scale: 1,
                transition: {
                    delay: index * 0.05,
                    type: 'spring',
                    stiffness: 200
                }
            }}
            whileHover={{
                y: -5,
                scale: 1.02,
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                transition: { duration: 0.2 }
            }}
            className='border-b border-gray-100 last:border-0'
            style={{
                transformStyle: 'preserve-3d'
            }}
        >
            <Link
                to={"/" + user?._id}
                onClick={onClose}
                className='flex items-center gap-4 p-4 hover:bg-gray-50 transition-all duration-200'
            >
                <motion.div
                    whileHover={{ rotateY: 10 }}
                    transition={{ type: 'spring' }}
                >
                    <Avatar
                        width={50}
                        height={50}
                        name={user?.name}
                        userId={user?._id}
                        imageUrl={user?.profile_pic}
                    />
                </motion.div>
                <div className='overflow-hidden'>
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ 
                            x: 0,
                            opacity: 1,
                            transition: {
                                delay: index * 0.05 + 0.1,
                                type: 'spring',
                                stiffness: 300
                            }
                        }}
                        className='font-semibold text-gray-800 truncate'
                    >
                        {user?.name}
                    </motion.div>
                    <motion.p
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ 
                            x: 0,
                            opacity: 1,
                            transition: {
                                delay: index * 0.05 + 0.15,
                                type: 'spring',
                                stiffness: 300
                            }
                        }}
                        className='text-sm text-gray-500 truncate'
                    >
                        {user?.email}
                    </motion.p>
                </div>
            </Link>
        </motion.div>
    );
};

export default UserSearchCard;