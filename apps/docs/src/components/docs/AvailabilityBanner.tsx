import Alert from '@mui/material/Alert';

type AvailabilityBannerProps = {
  componentName: string;
  version: string;
};

const AvailabilityBanner = ({
  componentName,
  version
}: AvailabilityBannerProps) => {
  return (
    <Alert
      severity="info"
      sx={{
        mb: '20px',
        '[data-mui-color-scheme="dark"] &': {
          bgcolor: 'rgba(41, 121, 255, 0.12)',
          border: '1px solid rgba(41, 121, 255, 0.3)'
        }
      }}
    >
      <b>
        {componentName}
      </b>
      {' is available from version '}
      <span>
        <b>
          {version}
        </b>
      </span>
      {' '}
      and above.
    </Alert>
  );
};

export default AvailabilityBanner;
