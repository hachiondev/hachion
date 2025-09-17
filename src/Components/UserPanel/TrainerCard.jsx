import React, { useState, useEffect, useRef } from 'react';
import './Course.css';
import axios from 'axios';
import './Corporate.css';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { BsFillPlayCircleFill } from 'react-icons/bs';
import { useParams } from 'react-router-dom';

const TrainerCard = (props) => {
  const [open, setOpen] = useState(false);
    const [matchedCourseName, setMatchedCourseName] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { courseName } = useParams();
  useEffect(() => {
      const fetchCourse = async () => {
        try {
          setLoading(true);
          const response = await axios.get('https://api.test.hachion.co/courses/all');
          const courseNameFromUrl = courseName?.toLowerCase()?.replace(/\s+/g, '-');
          const matchedCourse = response.data.find(
            (c) => c.courseName.toLowerCase().replace(/\s+/g, '-') === courseNameFromUrl
          );
  
          if (matchedCourse) {
            setMatchedCourseName(matchedCourse.courseName.trim());
          } else {
            setError('Course not found.');
          }
        } catch (error) {
          console.error('Error fetching course details:', error);
          setError('Failed to load course details.');
        } finally {
          setLoading(false);
        }
      };
  
      fetchCourse();
    }, [courseName]);
  
    useEffect(() => {
      if (!matchedCourseName) return;
  
      const fetchTrainer = async () => {
        try {
          const response = await axios.get('https://api.test.hachion.co/trainer');
          
        } catch (error) {
          console.error('Error fetching Trainer:', error.message);
          setError('Failed to load Trainer.');
        }
      };
  
      fetchTrainer();
    }, [matchedCourseName]);

  const videoLinks = props.demo_link_1
              ? props.demo_link_1.split('\n').map(demo_link_1 => demo_link_1.trim()).filter(demo_link_1 => demo_link_1)
              : [];
  return (
    <>
      <div className='trainer-card'>
        <div className='trainer-top'>
          <div className='learner-image'>
            <Avatar alt={props.trainer_name} src={props.profileImage || ''} className='profile-image' />
          </div>
          <div className='learner-info'>
            <div className='learner-name'>
              <p className='name'>{props.trainer_name}</p>
            </div>
            <p className='job-profile'>{props.profile}</p>
          </div>
        </div>
        <div className='trainer-description-bottom'>
          <p className='learner-description'>
          {props.summary ? props.summary.substring(0, 200) : ''}...
          <span className='read-more' onClick={() => setOpen(true)}> Read More</span>
          </p>
                    {videoLinks.length > 0 &&
                      videoLinks.map((videoLink, i) => {
                        const validUrl = videoLink.startsWith('http')
                          ? videoLink
                          : `https://${videoLink}`;
                        return (
                          <button
                            key={i}
                            className="demo-play-btn"
                            onClick={(e) => {
                            e.stopPropagation();
                            props.onPlayVideo(validUrl);
                          }}
                          >
                            <BsFillPlayCircleFill className="demo-icon-btn"/> 
                            <strong >Click hear to Watch Demo Video</strong>
                          </button>
                        );
                      })}
        </div>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle className='top'>
         About Trainer {props.name}
          <IconButton aria-label="close" onClick={() => setOpen(false)} className='close-button'>
            <CloseIcon style={{color: '#FFFFFF', background: '#00AEEF', borderRadius: '50%'}}/>
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className='trainer-popup-content'>
            <div className='trainer-top'>
          <div className='learner-image'>
            <Avatar alt={props.trainer_name} src={props.profileImage || ''} className='profile-image' />
            </div>
            <div className='learner-name'>
            <p className='name'>{props.trainer_name}</p>
                </div>
            <p className='job-profile'>{props.profile}</p>
            </div>
            <div className='trainer-description-bottom'>
            <p className='full-review'>{props.summary}</p>
             {videoLinks.length > 0 &&
                      videoLinks.map((videoLink, i) => {
                        const validUrl = videoLink.startsWith('http')
                          ? videoLink
                          : `https://${videoLink}`;
                        return (
                          <button
                            key={i}
                            className="demo-play-btn"
                            onClick={(e) => {
                            e.stopPropagation();
                            props.onPlayVideo(validUrl);
                          }}
                          >
                            <BsFillPlayCircleFill className="demo-icon-btn"/> 
                            <strong >Click hear to Watch Demo Video</strong>
                          </button>
                        );
                      })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TrainerCard;