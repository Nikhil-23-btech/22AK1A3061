import java.io.*;
import java.util.*;
class Smallestnumber{
	public static void main(String args[])
	{
	    Scanner sc=new Scanner(System.in);
	    int n=sc.nextInt();
		int[] arr = new int[n];
		System.out.println("Enter the array:");
		for(int i=0;i<n;i++){
		    arr[i]=sc.nextInt();
		}
		Arrays.sort(arr);
		System.out.println("smallest element is " + arr[0]);
		System.out.println("second smallest element is " + arr[1]);
	}
}

