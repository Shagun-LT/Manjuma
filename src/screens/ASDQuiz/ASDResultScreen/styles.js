import { StyleSheet } from 'react-native';

export default StyleSheet.create({
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
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  label: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  categoryContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
  },
  categoryLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
    marginBottom: 5,
  },
  categoryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scaleContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
  },
  scaleHeader: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
    marginBottom: 10,
  },
  scaleItem: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 5,
  },
  button: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 10,
  },
  gradientButton: {
    paddingVertical: 14,
    alignItems: 'center',
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