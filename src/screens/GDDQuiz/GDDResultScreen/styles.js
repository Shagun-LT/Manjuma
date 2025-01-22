import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  resultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  label: {
    fontSize: 16,
    color: '#4B5563',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
  },
  quotient: {
    fontSize: 20,
    color: '#A855F7',
  },
  button: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 10,
  },
  gradientButton: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loaderText: {
    color: '#ffffff',
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default styles; 