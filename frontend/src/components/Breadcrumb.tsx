import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Breadcrumbs,
  Typography,
  Link as MuiLink,
  Box,
  useTheme,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const theme = useTheme();

  const getBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', path: '/' }];

    let currentPath = '';

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Convert segment to readable label
      let label = segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());

      // Special cases for common routes
      switch (segment) {
        case 'patient':
          label = 'Patient Dashboard';
          break;
        case 'doctor':
          label = 'Doctor Dashboard';
          break;
        case 'hospital':
          label = 'Hospital Dashboard';
          break;
        case 'admin':
          label = 'Admin Dashboard';
          break;
        case 'search':
          label = 'Search Results';
          break;
        case 'login':
          label = 'Login';
          break;
        case 'register':
          label = 'Register';
          break;
        case 'forgot-password':
          label = 'Forgot Password';
          break;
        case 'reset-password':
          label = 'Reset Password';
          break;
        case 'change-password':
          label = 'Change Password';
          break;
        case 'approval-pending':
          label = 'Approval Pending';
          break;
      }

      breadcrumbs.push({
        label,
        path: index === pathSegments.length - 1 ? undefined : currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs(location.pathname);

  // Don't show breadcrumbs on home page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <Box
      sx={{
        py: 1,
        px: { xs: 2, sm: 3 },
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{
          '& .MuiBreadcrumbs-separator': {
            mx: 1,
          },
        }}
      >
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          if (isLast) {
            return (
              <Typography
                key={crumb.label}
                color="text.primary"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 500,
                }}
              >
                {index === 0 && <HomeIcon sx={{ mr: 0.5, fontSize: '1.1rem' }} />}
                {crumb.label}
              </Typography>
            );
          }

          return (
            <MuiLink
              key={crumb.label}
              component={Link}
              to={crumb.path!}
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline',
                },
              }}
            >
              {index === 0 && <HomeIcon sx={{ mr: 0.5, fontSize: '1.1rem' }} />}
              {crumb.label}
            </MuiLink>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default Breadcrumb;
