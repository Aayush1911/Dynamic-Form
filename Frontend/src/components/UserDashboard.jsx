import { Button, Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box, } from "@mui/material";

import { motion } from "framer-motion";

const AdminDashboard = () => {
    return (
     <Container
         style={{padding:"15px"}}
           maxWidth="xl"
           sx={{
             pb: 5,
             minHeight: "100vh",
             borderRadius: "12px",
             boxShadow: "0 15px 35px rgba(0, 0, 0, 0.1)",
           }}
         >
           {/* Title Section */}
           <motion.div
             initial={{ opacity: 0, y: -30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
           >
             <Typography
             
               variant="h3"
               align="center"
               gutterBottom
               sx={{
                fontFamily: "cursive",
                 fontWeight: 700,
                 color: "#2c3e50",
                 letterSpacing: "1px",
                 mt: 1.5,
               }}
             >
               Dynamic Form Builder
             </Typography>
     
             <Typography
               variant="body1"
               align="center"
               gutterBottom
               sx={{color: "#212121", maxWidth: "80%", mx: "auto", lineHeight: 1.8 }}
             >
               The Dynamic Form Generator is a powerful tool that lets users create,
               manage, and submit forms dynamically without coding. It offers an
               intuitive UI, real-time preview, and smooth data management.
             </Typography>
           </motion.div>
     
           {/* Feature and Technology Section */}
           <Grid container spacing={2} sx={{ mt:0.2}}>
             {/* Key Features */}
             <Grid item xs={12} md={6}>
               <motion.div
                 initial={{ opacity: 0, x: -30 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.6 }}
               >
                 <Card
                   sx={{
                     p: 1.5,
                     mx:4,
                     borderRadius: "12px",
                     boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                     transition: "0.3s",
                     "&:hover": {
                       boxShadow: "0 12px 30px rgba(0, 0, 0, 0.2)",
                     },
                   }}
                 >
                   <CardContent>
                     <Typography
                       variant="h5"
                       gutterBottom
                       sx={{ color: "#34495e", fontWeight: "bold" }}
                     >
                       🚀 Key Features
                     </Typography>
                     <ul style={{ lineHeight: 2, color: "#212121" }}>
                       <li>Supports multiple input types</li>
                       <li>Real-time form preview</li>
                       <li>Admin can create form</li>
                       <li>Only eligible user can access the form</li>
                       <li>Login and Signup Functionality</li>
                       <li>Download the submitted responses in pdf</li>
                       <li>Data validation & submission</li>
                       <li>Stores form schemas dynamically</li>
                       <li>Share form by its unique link</li>
                     </ul>
                   </CardContent>
                 </Card>
               </motion.div>
             </Grid>
     
             {/* Technologies Used */}
             <Grid item xs={12} md={6}>
               <motion.div
                 initial={{ opacity: 0, x: 30 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.6 }}
               >
                 <Card
                   sx={{
                     p: 1.5,
                     mx:4,
                     height: "100%",
                     borderRadius: "12px",
                     boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                     transition: "0.3s",
                     "&:hover": {
                       boxShadow: "0 12px 30px rgba(48, 46, 46, 0.2)",
                     },
                   }}
                 >
                   <CardContent>
                     <Typography
                       variant="h5"
                       gutterBottom
                       
                       sx={{ color: "#34495e", fontWeight: "bold" }}
                     >
                      🛠 Technologies Used
                     </Typography>
                     <ul style={{ lineHeight: 2.25, color: "#212121"  }}>
                     <li>⚛️ React.js (Frontend Framework)</li>
          <li>🎨 Material UI (Component Styling)</li>
          <li>🌐 Node.js & Express.js (Backend Server)</li>
          <li>🍃 MongoDB (NoSQL Database)</li>
          <li>🔗 Axios (API Communication)</li>
          <li>🔐 JWT (Authentication)</li>
          <li>📄 PDFKit / html2pdf.js (PDF Export)</li>
          <li>🚀 Vite (Dev Environment & Build Tool)</li>
                     </ul>
                   </CardContent>
                 </Card>
               </motion.div>
             </Grid>
           </Grid>
     {/* Access Control Panel Section */}


           {/* How It Works Section */}
           <Box sx={{ mt: 5 }}>
             <motion.div
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6 }}
             >
               <Card
                 sx={{
                   p: 4,
                   mx:4,
                   borderRadius: "12px",
                   boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                   transition: "0.3s",
                   "&:hover": {
                     boxShadow: "0 12px 30px rgba(0, 0, 0, 0.2)",
                   },
                 }}
               >
                 <CardContent>
                   <Typography
                     variant="h5"
                     gutterBottom
                     sx={{ color: "#34495e", fontWeight: "bold" }}
                   >
                    🔄 How It Works
                   </Typography>
                   <ol style={{ lineHeight: 2, color: "#212121" }}>
                     <li>Signup & Login using correct Credentials</li>
                     <li>Admin can only create a form</li>
                     <li>Admin can give access to appropriate users only</li>
                      <li>User login and can access their form</li>
                     <li>Users can submit data, which is stored in the database and can perform CRUD operations</li>
                     <li>Download the submited data in pdf format</li>
                   </ol>
                 </CardContent>
               </Card>
             </motion.div>
           </Box>
         </Container>
    );
  };
  
  export default AdminDashboard