import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AppBar, Toolbar, Typography, Container, Grid, Card, CardContent, Button, TextField, LinearProgress, Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline, IconButton, Divider, MenuItem
} from '@mui/material';
import { UploadFile, VideoLibrary, Settings, Menu, ChevronLeft, VideoLabel, Delete } from '@mui/icons-material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserMenu from './user';

const Dashboard = () => {
    const navigate = useNavigate();
    const [videoFile, setVideoFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [videoPath, setVideoPath] = useState('');
    const [format, setFormat] = useState('mp4');
    const [compressionLevel, setCompressionLevel] = useState('medium');
    const [selectedSection, setSelectedSection] = useState('Upload');
    const [drawerOpen, setDrawerOpen] = useState(true);
    const [userVideos, setUserVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState('');
    const [progress, setProgress] = useState(0);
    const [showProgress, setShowProgress] = useState(false);
    const username = localStorage.getItem('username');
    console.log('Retrieved username:', username);
    const [videoId, setVideoId] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');

        if (!token || !username) {
            navigate('/login');
        }
    }, [navigate]);

    const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

    const handleFileChange = (e) => setVideoFile(e.target.files[0]);

    const handleUpload = async () => {
        setLoading(true);
        const formData = new FormData();
        const username = localStorage.getItem('username'); // Get username from localStorage
        formData.append('video', videoFile);
        formData.append('username', username);

        try {
            const token = localStorage.getItem('token'); // Get token from localStorage
            const response = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            setVideoPath(response.data.videoPath);
            toast.success('Video uploaded successfully!');
            fetchUserVideos();
            setLoading(false);
        } catch (error) {
            toast.error('Error uploading video!');
            setLoading(false);
        }
    };
    const handleProcess = async () => {
        setLoading(true);
        try {
            // Retrieve the JWT token from localStorage (or wherever it's stored)
            const token = localStorage.getItem('token');
    
            // If there's no token, handle it appropriately (e.g., redirect to login)
            if (!token) {
                throw new Error('No authentication token found. Please log in.');
            }
    
            // Start video processing and get the videoId from the response
            const response = await axios.post('http://localhost:5000/api/process', {
                videoPath: selectedVideo,
                format,
                compressionLevel,
                username,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}` // Include the JWT token in the Authorization header
                }
            });
    
            console.log('Response data:', response.data); // Log entire response
            const videoId = response.data.videoId; // Retrieve videoId from the response
            console.log('Video ID:', videoId); // Log videoId
    
            if (videoId) {
                setVideoId(videoId); // Store the videoId in state (if necessary for further use)
                trackProgress(videoId); // Pass videoId to trackProgress function
            } else {
                throw new Error('Video ID is undefined');
            }
        } catch (error) {
            console.error('Error during processing:', error);
            toast.error('Error processing video!');
            setLoading(false);
        }
    };

    const trackProgress = async (videoId) => {
        console.log(`Starting progress tracking for video ID: ${videoId}`);  
    
        try {
            
            const token = localStorage.getItem('token');
    
           
            if (!token) {
                throw new Error('No authentication token found. Please log in.');
            }
    
            const intervalId = setInterval(async () => {
                console.log(`Polling for progress...`);  
    
                try {
                    const response = await axios.get(`http://localhost:5000/api/progress/${videoId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}` 
                        }
                    });
    
                    const progressData = response.data;
    
                    console.log(`Progress data received:`, progressData); 
    
                    if (progressData.progress !== undefined) {
                        console.log(`Updating progress bar to ${Math.round(progressData.progress)}%`);  
                        setProgress(Math.round(progressData.progress));  
                    }
    
                    if (progressData.progress >= 100) {
                        console.log(`Processing complete for video ID: ${videoId}`);  
                        clearInterval(intervalId); 
                        toast.success('Video processed successfully!');
                        setProgress(0); 
                        fetchUserVideos();  
                        setLoading(false);  
                    }
                } catch (error) {
                    console.error(`Error tracking progress for video ID: ${videoId}`, error); 
                    clearInterval(intervalId);
                    setLoading(false);
                }
            }, 1000);  // Poll every second
        } catch (error) {
            console.error(`Error starting progress tracking for video ID: ${videoId}`, error);  // Log any initial errors
            setLoading(false);
        }
    };
    const handleDelete = async (videoId) => {
        try {
           
            const token = localStorage.getItem('token');
    
           
            if (!token) {
                throw new Error('No authentication token found. Please log in.');
            }
    
           
            const response = await axios.delete(`http://localhost:5000/api/videos/${videoId}`, {
                headers: {
                    'Authorization': `Bearer ${token}` 
                },
                data: { username } 
            });
    
            console.log(response);
            toast.success('Video deleted successfully!');
            fetchUserVideos(); 
        } catch (error) {
            console.error('Error deleting video:', error);
            toast.error('Error deleting video!');
        }
    };


    const fetchUserVideos = async () => {
        try {
            const token = localStorage.getItem('token');  // Get token from local storage
            const response = await axios.get(`http://localhost:5000/api/videos/${username}`, {
                headers: {
                    Authorization: `Bearer ${token}`  // Include the token in the Authorization header
                }
            });
            setUserVideos(response.data.videos);
        } catch (error) {
            console.error('Error fetching user videos:', error);
        }
    };

    useEffect(() => {
        fetchUserVideos();
    }, [username]);

    const renderSection = () => {
        if (selectedSection === 'Upload') {
            return (
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="div">Upload Video</Typography>
                            <input type="file" onChange={handleFileChange} />
                            <Button variant="contained" color="primary" onClick={handleUpload} style={{ marginTop: '10px' }}>
                                Upload
                            </Button>
                            {loading && <LinearProgress style={{ marginTop: '10px' }} />}
                        </CardContent>
                    </Card>
                </Grid>
            );
        } else if (selectedSection === 'Process') {
            return (
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="div">Process Video</Typography>
                            <TextField
                                select
                                label="Select Video"
                                value={selectedVideo}
                                onChange={(e) => {
                                    setSelectedVideo(e.target.value);
                                    setVideoPath(e.target.value);
                                }}
                                fullWidth
                                style={{ marginBottom: '10px' }}
                            >
                                {userVideos.map((video, index) => (
                                    <MenuItem key={index} value={video.originalPath}>
                                        {video.originalPath.split('\\').pop()}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                label="Format"
                                value={format}
                                onChange={(e) => setFormat(e.target.value)}
                                fullWidth
                                style={{ marginBottom: '10px' }}
                            />
                            <TextField
                                label="Compression Level"
                                value={compressionLevel}
                                onChange={(e) => setCompressionLevel(e.target.value)}
                                fullWidth
                            />

                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleProcess}
                                style={{ marginTop: '10px', marginRight: '10px' }}  // Added marginRight for spacing
                            >
                                Process
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    setShowProgress(!showProgress);
                                    if (!showProgress) {
                                        trackProgress(videoId); // Pass the correct videoId here
                                    }
                                }}
                                style={{ marginTop: '10px' }}  // Ensure consistent margin on both buttons
                            >
                                {showProgress ? "Hide Progress" : "Show Progress"}
                            </Button>

                            {showProgress && (
                                <div style={{ marginTop: '20px' }}>
                                    <Typography variant="subtitle1">Processing Progress: {progress}%</Typography>
                                    <LinearProgress variant="determinate" value={progress} />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            );
        } else if (selectedSection === 'Videos') {
            return (
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="div">Your Videos</Typography>
                            {userVideos && userVideos.length > 0 ? (
                                userVideos.map((video, index) => (
                                    <div key={index} style={{ marginBottom: '20px' }}>
                                        <Typography variant="subtitle1">
                                            <strong>Original:</strong> {video.originalPath ? video.originalPath.split('\\').pop() : 'N/A'}
                                        </Typography>
                                        <Typography variant="subtitle1">
                                            <strong>Processed:</strong> {video.processedPath ? video.processedPath.split(/[/\\]/).pop() : 'Processing not completed yet.'}
                                        </Typography>
                                        {video.processedPath && (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    href={`http://localhost:5000/videos/${video.processedPath.split('/').pop()}`}
                                                    download
                                                    style={{ marginRight: '10px' }}
                                                >
                                                    Download
                                                </Button>
                                                <div style={{ marginTop: '10px' }}>
                                                    <video width="400" controls>
                                                        <source src={`http://localhost:5000/videos/${video.processedPath.split('/').pop()}`} type="video/mp4" />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                </div>
                                            </>
                                        )}
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleDelete(video.id)}
                                        >
                                            DELETE
                                        </Button>
                                        <Divider style={{ margin: '10px 0' }} />
                                    </div>
                                ))
                            ) : (
                                <Typography variant="body1">No videos found.</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            );
        }
    };


    return (
        <div style={{ display: 'flex' }}>
            <CssBaseline />
            <ToastContainer />
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerToggle}
                        edge="start"
                        sx={{ mr: 2, ...(drawerOpen && { display: 'none' }) }}
                    >
                        <Menu />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Welcome, {username}!
                    </Typography>
                    <UserMenu />
                </Toolbar>
            </AppBar>

            <Drawer
                variant="persistent"
                open={drawerOpen}
                sx={{
                    width: drawerOpen ? 240 : 0,
                    flexShrink: 0,
                    transition: 'width 0.3s',
                    [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
                }}
            >
                <Toolbar>
                    <IconButton onClick={handleDrawerToggle}>
                        <ChevronLeft />
                    </IconButton>
                </Toolbar>
                <Divider />
                <List>
                    <ListItem button onClick={() => setSelectedSection('Upload')}>
                        <ListItemIcon><UploadFile /></ListItemIcon>
                        <ListItemText primary="Upload Video" />
                    </ListItem>
                    <ListItem button onClick={() => setSelectedSection('Process')}>
                        <ListItemIcon><VideoLibrary /></ListItemIcon>
                        <ListItemText primary="Process Video" />
                    </ListItem>
                    <ListItem button onClick={() => setSelectedSection('Videos')}>
                        <ListItemIcon><VideoLabel /></ListItemIcon>
                        <ListItemText primary="Your Videos" />
                    </ListItem>
                </List>
            </Drawer>

            <Container maxWidth={false} style={{ marginLeft: drawerOpen ? 240 : 0, marginTop: 80 }}>
                <Grid container spacing={3}>
                    {renderSection()}
                </Grid>
            </Container>
        </div>
    );
};

export default Dashboard;
